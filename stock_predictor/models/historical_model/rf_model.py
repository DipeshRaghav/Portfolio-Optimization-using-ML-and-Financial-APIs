"""
Historical statistics model: rolling return / vol / momentum → RandomForest.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

from stock_predictor.features.historical_stats import add_historical_features
from stock_predictor.utils.config import ModelConfig


HIST_COLS: List[str] = [
    "ret_1",
    "ret_5",
    "ret_20",
    "vol_10",
    "vol_20",
    "mom_10",
    "mom_20",
]


@dataclass
class HistoricalRFModel:
    _clf: Any = None
    _fitted: bool = False

    def _ensure(self):
        if self._clf is None:
            self._clf = RandomForestClassifier(
                n_estimators=120,
                max_depth=6,
                random_state=ModelConfig().random_seed,
                n_jobs=-1,
            )

    def fit(self, ohlcv: pd.DataFrame) -> None:
        df = add_historical_features(ohlcv).dropna()
        if len(df) < 100:
            raise ValueError("Need more history for historical model.")
        df["target"] = (df["close"].shift(-1) > df["close"]).astype(int)
        df = df.iloc[:-1]
        X = df[HIST_COLS].values
        y = df["target"].values
        self._ensure()
        X_tr, _, y_tr, _ = train_test_split(
            X, y, test_size=0.2, random_state=ModelConfig().random_seed
        )
        self._clf.fit(X_tr, y_tr)
        self._fitted = True

    def predict(self, ohlcv: pd.DataFrame) -> Dict[str, float]:
        df = add_historical_features(ohlcv).dropna()
        self._ensure()
        if not self._fitted:
            self.fit(ohlcv)
        row = df[HIST_COLS].iloc[-1:].values
        proba = self._clf.predict_proba(row)[0, 1]
        return {"prob_up": float(proba), "raw_score": float(proba)}
