"""
Market context model: maps index trend, volatility, sector strength → bias score.

Default: interpretable logistic-style score from normalized features (no training data needed).
Optional: fit LogisticRegression on labels derived from next-day returns (demo).
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Optional

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

from stock_predictor.features.market_context_features import market_features_vector
from stock_predictor.utils.config import ModelConfig


def _rule_based_prob(v: np.ndarray) -> float:
    """Hand-tuned weights as a stand-in for a trained calibration layer."""
    z = (
        1.8 * v[0]
        - 1.2 * np.abs(v[1])
        + 0.9 * v[2]
        + 0.4 * v[3]
    )
    return float(1.0 / (1.0 + np.exp(-z)))


@dataclass
class MarketContextModel:
    _clf: Optional[Any] = None
    _fitted: bool = False

    def fit(self, ohlcv: pd.DataFrame, market_context_series: pd.Series) -> None:
        """
        Pairs repeated context vector with forward return sign from price series.
        """
        df = ohlcv.copy()
        df.columns = [c.lower() for c in df.columns]
        y_series = (df["close"].shift(-1) > df["close"]).astype(int)
        base = market_features_vector(market_context_series)
        rng = np.random.default_rng(ModelConfig().random_seed)
        X_list = []
        y_list = []
        for i in range(len(df) - 1):
            if pd.isna(y_series.iloc[i]):
                continue
            noise = rng.normal(0, 0.03, size=base.shape)
            X_list.append(base + noise)
            y_list.append(y_series.iloc[i])
        if len(X_list) < 30:
            self._fitted = False
            return
        X = np.stack(X_list)
        y = np.array(y_list)
        self._clf = LogisticRegression(max_iter=300, random_state=ModelConfig().random_seed)
        X_tr, _, y_tr, _ = train_test_split(X, y, test_size=0.25, random_state=ModelConfig().random_seed)
        self._clf.fit(X_tr, y_tr)
        self._fitted = True

    def predict(self, ohlcv: pd.DataFrame, market_context: pd.Series) -> Dict[str, float]:
        v = market_features_vector(market_context)
        if self._fitted and self._clf is not None:
            proba = float(self._clf.predict_proba(v.reshape(1, -1))[0, 1])
        else:
            proba = _rule_based_prob(v)
        bias = (proba - 0.5) * 2.0
        return {
            "market_bias": float(bias),
            "prob_up": float(proba),
            "raw_score": float(proba),
        }
