"""
Technical indicators: RSI, MACD, moving averages, Bollinger Bands.

Implemented with pandas for transparency (no hidden TA-lib dependency).
"""

from __future__ import annotations

import numpy as np
import pandas as pd


def _rsi(close: pd.Series, period: int = 14) -> pd.Series:
    delta = close.diff()
    gain = delta.clip(lower=0.0)
    loss = (-delta).clip(lower=0.0)
    avg_gain = gain.ewm(alpha=1 / period, adjust=False).mean()
    avg_loss = loss.ewm(alpha=1 / period, adjust=False).mean()
    rs = avg_gain / (avg_loss + 1e-12)
    return 100 - (100 / (1 + rs))


def _macd(close: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9):
    ema_fast = close.ewm(span=fast, adjust=False).mean()
    ema_slow = close.ewm(span=slow, adjust=False).mean()
    line = ema_fast - ema_slow
    sig = line.ewm(span=signal, adjust=False).mean()
    hist = line - sig
    return line, sig, hist


def _bollinger(close: pd.Series, period: int = 20, num_std: float = 2.0):
    mid = close.rolling(period).mean()
    std = close.rolling(period).std()
    upper = mid + num_std * std
    lower = mid - num_std * std
    return mid, upper, lower


def add_technical_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """
    Expects columns: open, high, low, close, volume (any case).
    Returns a copy with indicator columns added.
    """
    out = df.copy()
    out.columns = [c.lower() for c in out.columns]
    c = out["close"]

    out["rsi_14"] = _rsi(c, 14)
    macd_line, macd_sig, macd_hist = _macd(c)
    out["macd"] = macd_line
    out["macd_signal"] = macd_sig
    out["macd_hist"] = macd_hist
    out["ma_10"] = c.rolling(10).mean()
    out["ma_20"] = c.rolling(20).mean()
    out["ma_50"] = c.rolling(50).mean()
    mid, up, low_bb = _bollinger(c, 20, 2.0)
    out["bb_mid"] = mid
    out["bb_upper"] = up
    out["bb_lower"] = low_bb
    out["bb_width"] = (up - low_bb) / (mid + 1e-12)

    return out
