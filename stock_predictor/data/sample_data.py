"""
Synthetic OHLCV paths, mock news, and market context for demos and tests.

Replace with real vendor / API data in production.
"""

from __future__ import annotations

import numpy as np
import pandas as pd


def generate_ohlcv(
    n_days: int = 500,
    seed: int = 42,
    start_price: float = 100.0,
    annual_drift: float = 0.08,
    annual_vol: float = 0.22,
) -> pd.DataFrame:
    """
    Geometric Brownian motion for close; derive OHLV coherently (simplified).
    """
    rng = np.random.default_rng(seed)
    dt = 1 / 252
    daily_mu = annual_drift / 252 - 0.5 * (annual_vol**2) / 252
    daily_sig = annual_vol / np.sqrt(252)

    log_ret = daily_mu + daily_sig * rng.standard_normal(n_days)
    close = start_price * np.exp(np.cumsum(log_ret))

    noise = rng.normal(0, 0.002 * close, n_days)
    high = np.maximum(close * (1 + np.abs(noise)), close)
    low = np.minimum(close * (1 - np.abs(noise)), close)
    open_ = np.roll(close, 1)
    open_[0] = start_price
    volume = rng.integers(1_000_000, 5_000_000, n_days).astype(float)

    idx = pd.date_range(end=pd.Timestamp.today(), periods=n_days, freq="B")
    return pd.DataFrame(
        {"open": open_, "high": high, "low": low, "close": close, "volume": volume},
        index=idx,
    )


def mock_news_headlines(symbol: str = "DEMO") -> list[str]:
    """Placeholder headlines; swap for live news API results."""
    return [
        f"{symbol} beats earnings expectations, raises guidance",
        "Analysts upgrade stock citing strong cash flows",
        "Sector tailwinds support near-term outlook",
        "Regulatory concerns weigh on sentiment",
        f"{symbol} announces new product line, shares volatile",
    ]


def mock_market_context_row(seed: int = 0) -> pd.Series:
    """
    One row of market context: index trend, vol index, sector strength.
    Uses generic names; map NIFTY/VIX in production for Indian markets.
    """
    rng = np.random.default_rng(seed)
    return pd.Series(
        {
            "index_return_20d": rng.normal(0.02, 0.04),
            "vix_level": float(rng.uniform(12, 35)),
            "sector_strength": float(rng.uniform(-1, 1)),
            "breadth": float(rng.uniform(0.3, 0.7)),
        }
    )
