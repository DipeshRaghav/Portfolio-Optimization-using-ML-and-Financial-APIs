"""
Build (samples, timesteps, features) tensors from OHLCV for LSTM/CNN inputs.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from stock_predictor.utils.helpers import min_max_scale


def ohlcv_to_matrix(df: pd.DataFrame) -> np.ndarray:
    out = df.copy()
    out.columns = [c.lower() for c in out.columns]
    mat = out[["open", "high", "low", "close", "volume"]].values.astype(np.float64)
    return mat


def normalize_window(window: np.ndarray) -> np.ndarray:
    """Min-max each feature over the window (per channel)."""
    # window shape (T, F)
    norm = np.zeros_like(window)
    for f in range(window.shape[1]):
        norm[:, f] = min_max_scale(window[:, f])
    return norm


def ohlcv_to_sequences(
    df: pd.DataFrame,
    seq_len: int = 60,
    stride: int = 1,
) -> tuple[np.ndarray, np.ndarray]:
    """
    Returns X of shape (N, seq_len, 5) and y binary labels: 1 if next close > current close.
    """
    mat = ohlcv_to_matrix(df)
    closes = mat[:, 3]
    X_list, y_list = [], []
    for i in range(0, len(mat) - seq_len - 1, stride):
        w = mat[i : i + seq_len]
        w_norm = normalize_window(w)
        nxt = closes[i + seq_len]
        cur = closes[i + seq_len - 1]
        X_list.append(w_norm)
        y_list.append(1.0 if nxt > cur else 0.0)
    if not X_list:
        return np.empty((0, seq_len, 5)), np.empty((0,))
    return np.stack(X_list), np.array(y_list)


def last_sequence(df: pd.DataFrame, seq_len: int = 60) -> np.ndarray:
    """Single latest normalized window for inference, shape (1, seq_len, 5)."""
    mat = ohlcv_to_matrix(df)
    if len(mat) < seq_len:
        raise ValueError(f"Need at least {seq_len} rows, got {len(mat)}")
    w = mat[-seq_len:]
    w_norm = normalize_window(w)
    return w_norm[np.newaxis, ...]
