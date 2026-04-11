"""Small helpers: normalization, safe division."""

from __future__ import annotations

import numpy as np
import pandas as pd


def min_max_scale(arr: np.ndarray, eps: float = 1e-8) -> np.ndarray:
    a = np.asarray(arr, dtype=np.float64)
    mn, mx = np.nanmin(a), np.nanmax(a)
    if mx - mn < eps:
        return np.zeros_like(a)
    return (a - mn) / (mx - mn)


def clip_prob(x: float) -> float:
    return float(np.clip(x, 0.0, 1.0))


def ensure_ohlcv(df: pd.DataFrame) -> pd.DataFrame:
    cols = ["open", "high", "low", "close", "volume"]
    missing = set(cols) - set(c.lower() for c in df.columns)
    if missing:
        raise ValueError(f"OHLCV DataFrame missing columns: {missing}")
    out = df.copy()
    out.columns = [c.lower() for c in out.columns]
    return out
