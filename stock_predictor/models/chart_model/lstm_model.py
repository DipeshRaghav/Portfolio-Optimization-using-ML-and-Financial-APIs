"""
Chart-based model: LSTM on last N OHLCV timesteps → P(price up).

Uses TensorFlow/Keras when available; falls back to a sklearn MLPClassifier on the
flattened window so the pipeline still runs without TensorFlow.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Optional

import numpy as np
import pandas as pd

from stock_predictor.features.chart_sequences import last_sequence, ohlcv_to_sequences
from stock_predictor.utils.config import ModelConfig

try:
    import tensorflow as tf  # type: ignore
except Exception:  # pragma: no cover - optional dependency
    tf = None


@dataclass
class ChartLSTMModel:
    seq_len: int = 60
    _keras: Any = None
    _sk: Any = None
    _use_keras: bool = True
    _is_trained: bool = False

    def _build_keras(self, n_features: int = 5):
        model = tf.keras.Sequential(
            [
                tf.keras.layers.Input(shape=(self.seq_len, n_features)),
                tf.keras.layers.LSTM(32, return_sequences=False),
                tf.keras.layers.Dropout(0.2),
                tf.keras.layers.Dense(16, activation="relu"),
                tf.keras.layers.Dense(1, activation="sigmoid"),
            ]
        )
        model.compile(
            optimizer=tf.keras.optimizers.Adam(1e-3),
            loss="binary_crossentropy",
            metrics=["accuracy"],
        )
        return model

    def _build_sklearn(self):
        from sklearn.neural_network import MLPClassifier

        return MLPClassifier(
            hidden_layer_sizes=(64, 32),
            max_iter=120,
            random_state=ModelConfig().random_seed,
        )

    def fit(self, ohlcv: pd.DataFrame, epochs: int = 8, batch_size: int = 32) -> None:
        X, y = ohlcv_to_sequences(ohlcv, seq_len=self.seq_len)
        if len(X) < 32:
            raise ValueError("Not enough rows to train chart model (need ~100+ days).")

        if tf is not None:
            tf.keras.utils.set_random_seed(ModelConfig().random_seed)
            self._keras = self._build_keras()
            self._keras.fit(
                X,
                y,
                epochs=epochs,
                batch_size=min(batch_size, len(X)),
                verbose=0,
                validation_split=0.1,
            )
            self._use_keras = True
        else:
            Xf = X.reshape(len(X), -1)
            self._sk = self._build_sklearn()
            self._sk.fit(Xf, y)
            self._use_keras = False
        self._is_trained = True

    def predict(self, ohlcv: pd.DataFrame) -> Dict[str, float]:
        if not self._is_trained:
            self.fit(ohlcv, epochs=5)

        x = last_sequence(ohlcv, seq_len=self.seq_len)
        if self._use_keras and self._keras is not None:
            prob = float(self._keras.predict(x, verbose=0)[0, 0])
        else:
            xf = x.reshape(1, -1)
            prob = float(self._sk.predict_proba(xf)[0, 1])
        return {"prob_up": prob, "raw_score": prob}
