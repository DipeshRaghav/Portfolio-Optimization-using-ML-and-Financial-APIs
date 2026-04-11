"""Rolling return, volatility, momentum features for the historical ML model."""

from __future__ import annotations

import numpy as np
import pandas as pd


def add_historical_features(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    out.columns = [c.lower() for c in out.columns]
    c = out["close"]
    out["ret_1"] = c.pct_change()
    out["ret_5"] = c.pct_change(5)
    out["ret_20"] = c.pct_change(20)
    out["vol_10"] = out["ret_1"].rolling(10).std()
    out["vol_20"] = out["ret_1"].rolling(20).std()
    out["mom_10"] = c / c.shift(10) - 1.0
    out["mom_20"] = c / c.shift(20) - 1.0
    return out


def historical_feature_row(feat_df: pd.DataFrame) -> np.ndarray:
    """Last row as vector for sklearn models (drop NaNs forward-filled)."""
    sub = feat_df[
        ["ret_1", "ret_5", "ret_20", "vol_10", "vol_20", "mom_10", "mom_20"]
    ].copy()
    sub = sub.ffill().bfill()
    vec = sub.iloc[-1].values.astype(np.float64)
    return np.nan_to_num(vec, nan=0.0)
