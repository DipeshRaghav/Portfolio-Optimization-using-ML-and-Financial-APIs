"""
Build (samples, timesteps, features) tensors from OHLCV for LSTM/CNN inputs.

Chart model uses an enriched feature set per bar (OHLCV + returns, range, volume z-score).
Labels default to *forward-horizon* positive return (e.g. 5 trading days ahead vs current close).
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from stock_predictor.utils.helpers import min_max_scale

# Raw OHLCV only — used by reasoning helpers and legacy callers.
def ohlcv_to_matrix(df: pd.DataFrame) -> np.ndarray:
    out = df.copy()
    out.columns = [c.lower() for c in out.columns]
    mat = out[["open", "high", "low", "close", "volume"]].values.astype(np.float64)
    return mat


CHART_FEATURE_COLUMNS: tuple[str, ...] = (
    "open",
    "high",
    "low",
    "close",
    "volume",
    "ret1",
    "ret5",
    "hl_range",
    "body",
    "vol_z",
)


def enrich_ohlcv_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add return, range, and volume-normalized columns (no future leakage)."""
    out = df.copy()
    out.columns = [str(c).lower() for c in out.columns]
    c = out["close"].astype(np.float64)
    o = out["open"].astype(np.float64)
    h = out["high"].astype(np.float64)
    l = out["low"].astype(np.float64)
    v = out["volume"].astype(np.float64)

    prev_c = c.shift(1).replace(0, np.nan)
    prev5 = c.shift(5).replace(0, np.nan)
    out["ret1"] = np.log(c / prev_c).replace([np.inf, -np.inf], np.nan).fillna(0.0)
    out["ret5"] = np.log(c / prev5).replace([np.inf, -np.inf], np.nan).fillna(0.0)
    out["hl_range"] = (h - l) / (c.abs() + 1e-12)
    out["body"] = (c - o).abs() / (c.abs() + 1e-12)
    mean20 = v.rolling(20, min_periods=1).mean()
    std20 = v.rolling(20, min_periods=1).std() + 1e-12
    out["vol_z"] = (v - mean20) / std20
    return out


def chart_feature_matrix(df: pd.DataFrame) -> np.ndarray:
    """Shape (T, n_features) with fixed column order."""
    d = enrich_ohlcv_features(df)
    for col in CHART_FEATURE_COLUMNS:
        if col not in d.columns:
            raise ValueError(f"chart_feature_matrix: missing column {col}")
    m = d[list(CHART_FEATURE_COLUMNS)].values.astype(np.float64)
    return np.nan_to_num(m, nan=0.0, posinf=0.0, neginf=0.0)


def normalize_window(window: np.ndarray) -> np.ndarray:
    """Min-max each feature over the window (per channel)."""
    norm = np.zeros_like(window)
    for f in range(window.shape[1]):
        norm[:, f] = min_max_scale(window[:, f])
    return norm


def ohlcv_to_sequences(
    df: pd.DataFrame,
    seq_len: int = 60,
    stride: int = 1,
    *,
    forward_horizon: int = 5,
) -> tuple[np.ndarray, np.ndarray]:
    """
    Returns X of shape (N, seq_len, F) and y binary labels.

    Label = 1 iff close[end + forward_horizon] > close[end], where end is the last
    index of the window (multi-day directional signal; less noisy than 1-bar).
    """
    mat = chart_feature_matrix(df)
    dc = df.copy()
    dc.columns = [str(c).lower() for c in dc.columns]
    close_series = dc["close"].values.astype(np.float64)
    if len(mat) != len(close_series):
        raise ValueError("enriched features length mismatch vs close")
    if len(mat) < seq_len + forward_horizon:
        return np.empty((0, seq_len, mat.shape[1])), np.array([])

    X_list: list[np.ndarray] = []
    y_list: list[float] = []
    last_i = len(mat) - seq_len - forward_horizon + 1
    for i in range(0, last_i, stride):
        w = mat[i : i + seq_len]
        w_norm = normalize_window(w)
        end = i + seq_len - 1
        y_list.append(1.0 if close_series[end + forward_horizon] > close_series[end] else 0.0)
        X_list.append(w_norm)

    if not X_list:
        return np.empty((0, seq_len, mat.shape[1])), np.array([])
    return np.stack(X_list), np.array(y_list)


def last_sequence(df: pd.DataFrame, seq_len: int = 60) -> np.ndarray:
    """Latest normalized window for inference, shape (1, seq_len, n_features)."""
    mat = chart_feature_matrix(df)
    if len(mat) < seq_len:
        raise ValueError(f"Need at least {seq_len} rows, got {len(mat)}")
    w = mat[-seq_len:]
    w_norm = normalize_window(w)
    return w_norm[np.newaxis, ...]


def n_chart_features(df: pd.DataFrame) -> int:
    return chart_feature_matrix(df).shape[1]
