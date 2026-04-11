"""
Loads and bundles data for the multi-model pipeline.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import pandas as pd

from stock_predictor.data.sample_data import (
    generate_ohlcv,
    mock_market_context_row,
    mock_news_headlines,
)


@dataclass
class DataBundle:
    """Everything needed for one prediction pass."""

    symbol: str
    ohlcv: pd.DataFrame
    news_headlines: list[str]
    market_context: pd.Series


def build_data_bundle(
    symbol: str = "DEMO",
    n_days: int = 500,
    seed: int = 42,
    ohlcv: Optional[pd.DataFrame] = None,
) -> DataBundle:
    if ohlcv is None:
        ohlcv = generate_ohlcv(n_days=n_days, seed=seed)
    news = mock_news_headlines(symbol)
    ctx = mock_market_context_row(seed=seed + 1)
    return DataBundle(
        symbol=symbol,
        ohlcv=ohlcv,
        news_headlines=news,
        market_context=ctx,
    )
