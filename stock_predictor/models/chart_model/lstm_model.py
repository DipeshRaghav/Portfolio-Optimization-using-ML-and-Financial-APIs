"""
Chart-based model: stacked LSTM on last N enriched OHLCV bars → P(positive forward return).

Uses TensorFlow/Keras when available (early stopping, class weights, LR reduction);
falls back to sklearn MLPClassifier on flattened windows without TensorFlow.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict

import numpy as np
import pandas as pd

from stock_predictor.features.chart_sequences import (
    CHART_FEATURE_COLUMNS,
    chart_feature_matrix,
    last_sequence,
    ohlcv_to_sequences,
)
from stock_predictor.utils.config import ModelConfig

try:
    import tensorflow as tf  # type: ignore
except Exception:  # pragma: no cover - optional dependency
    tf = None


def _class_weights_binary(y: np.ndarray) -> Optional[Dict[int, float]]:
    y_int = y.astype(np.int32)
    uniq = np.unique(y_int)
    if len(uniq) < 2:
        return None
    from sklearn.utils.class_weight import compute_class_weight

    w = compute_class_weight(class_weight="balanced", classes=np.array([0, 1]), y=y_int)
    return {int(i): float(w[i]) for i in range(2)}


@dataclass
class ChartLSTMModel:
    seq_len: int = 60
    _keras: Any = None
    _sk: Any = None
    _use_keras: bool = True
    _is_trained: bool = False
    _forward_horizon: int = 5
    _n_features: int = 10

    def _build_keras(self, n_features: int) -> Any:
        reg = tf.keras.regularizers.l2(1e-5)
        model = tf.keras.Sequential(
            [
                tf.keras.layers.Input(shape=(self.seq_len, n_features)),
                tf.keras.layers.LSTM(64, return_sequences=True, kernel_regularizer=reg),
                tf.keras.layers.Dropout(0.25),
                tf.keras.layers.LSTM(32, return_sequences=False, kernel_regularizer=reg),
                tf.keras.layers.Dropout(0.2),
                tf.keras.layers.Dense(24, activation="relu"),
                tf.keras.layers.Dense(1, activation="sigmoid"),
            ]
        )
        model.compile(
            optimizer=tf.keras.optimizers.Adam(1e-3),
            loss="binary_crossentropy",
            metrics=["accuracy"],
        )
        return model

    def _build_sklearn(self, n_in: int):
        from sklearn.neural_network import MLPClassifier

        return MLPClassifier(
            hidden_layer_sizes=(128, 64),
            max_iter=180,
            alpha=1e-4,
            random_state=ModelConfig().random_seed,
        )

    def _meta(self) -> Dict[str, Any]:
        return {
            "forward_horizon": self._forward_horizon,
            "n_features": self._n_features,
            "sequence_length": self.seq_len,
            "feature_names": list(CHART_FEATURE_COLUMNS),
        }

    def fit(self, ohlcv: pd.DataFrame, epochs: int = 8, batch_size: int = 32) -> None:
        cfg = ModelConfig()
        self._forward_horizon = cfg.chart_forward_horizon
        X, y = ohlcv_to_sequences(
            ohlcv,
            seq_len=self.seq_len,
            forward_horizon=self._forward_horizon,
        )
        self._n_features = int(chart_feature_matrix(ohlcv).shape[1])
        if len(X) < 32:
            raise ValueError("Not enough rows to train chart model (need ~100+ days for seq + horizon).")

        cw = _class_weights_binary(y)

        if tf is not None:
            tf.keras.utils.set_random_seed(ModelConfig().random_seed)
            n_feat = int(X.shape[2])
            self._keras = self._build_keras(n_feat)
            n = len(X)
            val_split = 0.15 if n >= 50 else (0.2 if n >= 35 else 0.1)
            if n < 20 or int(n * val_split) < 3:
                val_split = 0.0

            fit_kwargs: Dict[str, Any] = {
                "epochs": epochs,
                "batch_size": min(batch_size, len(X)),
                "verbose": 0,
                "shuffle": True,
            }
            if cw is not None:
                fit_kwargs["class_weight"] = cw

            if val_split > 0:
                fit_kwargs["validation_split"] = val_split
                callbacks = []
                if epochs >= 4:
                    callbacks.append(
                        tf.keras.callbacks.EarlyStopping(
                            monitor="val_loss",
                            patience=min(5, max(2, epochs // 3)),
                            restore_best_weights=True,
                            min_delta=1e-4,
                        )
                    )
                    callbacks.append(
                        tf.keras.callbacks.ReduceLROnPlateau(
                            monitor="val_loss",
                            factor=0.5,
                            patience=2,
                            min_lr=1e-5,
                        )
                    )
                fit_kwargs["callbacks"] = callbacks

            self._keras.fit(X, y, **fit_kwargs)
            self._use_keras = True
        else:
            Xf = X.reshape(len(X), -1)
            self._sk = self._build_sklearn(Xf.shape[1])
            if cw is not None:
                # MLPClassifier supports sample_weight
                sw = np.array([cw[int(t)] for t in y])
                self._sk.fit(Xf, y, sample_weight=sw)
            else:
                self._sk.fit(Xf, y)
            self._use_keras = False
        self._is_trained = True

    def predict(self, ohlcv: pd.DataFrame) -> Dict[str, Any]:
        if not self._is_trained:
            self.fit(ohlcv, epochs=5)

        x = last_sequence(ohlcv, seq_len=self.seq_len)
        if self._use_keras and self._keras is not None:
            prob = float(self._keras.predict(x, verbose=0)[0, 0])
        else:
            xf = x.reshape(1, -1)
            prob = float(self._sk.predict_proba(xf)[0, 1])
        out: Dict[str, Any] = {"prob_up": prob, "raw_score": prob, "meta": self._meta()}
        return out
