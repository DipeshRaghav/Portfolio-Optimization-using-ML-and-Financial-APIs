"""
Technical indicator model: engineered features + XGBoost classifier.

Output: probability of positive next-day return (buy signal strength).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

from stock_predictor.features.technical import add_technical_indicators
from stock_predictor.utils.config import ModelConfig


FEATURE_COLS: List[str] = [
    "rsi_14",
    "macd",
    "macd_signal",
    "macd_hist",
    "ma_10",
    "ma_20",
    "ma_50",
    "bb_width",
]


@dataclass
class IndicatorXGBModel:
    _clf: Any = None
    _fitted: bool = False
    _feature_cols: List[str] = field(default_factory=lambda: list(FEATURE_COLS))

    def _ensure_model(self):
        if self._clf is None:
            try:
                from xgboost import XGBClassifier

                self._clf = XGBClassifier(
                    n_estimators=80,
                    max_depth=4,
                    learning_rate=0.08,
                    subsample=0.9,
                    random_state=ModelConfig().random_seed,
                    verbosity=0,
                )
            except ImportError:
                from sklearn.ensemble import RandomForestClassifier

                self._clf = RandomForestClassifier(
                    n_estimators=100,
                    max_depth=6,
                    random_state=ModelConfig().random_seed,
                    n_jobs=-1,
                )

    def fit(self, ohlcv: pd.DataFrame) -> None:
        df = add_technical_indicators(ohlcv)
        df = df.dropna()
        if len(df) < 80:
            raise ValueError("Insufficient rows after indicators.")
        df["target"] = (df["close"].shift(-1) > df["close"]).astype(int)
        df = df.iloc[:-1]

        X = df[self._feature_cols].values
        y = df["target"].values
        self._ensure_model()
        X_tr, X_te, y_tr, y_te = train_test_split(
            X, y, test_size=0.2, random_state=ModelConfig().random_seed
        )
        self._clf.fit(X_tr, y_tr)
        self._fitted = True

    def predict(self, ohlcv: pd.DataFrame) -> Dict[str, float]:
        df = add_technical_indicators(ohlcv).dropna()
        if len(df) < 5:
            raise ValueError("Not enough data for indicators.")
        self._ensure_model()
        if not self._fitted:
            self.fit(ohlcv)
        row = df[self._feature_cols].iloc[-1:].values
        proba = self._clf.predict_proba(row)[0, 1]
        return {"prob_up": float(proba), "raw_score": float(proba)}
