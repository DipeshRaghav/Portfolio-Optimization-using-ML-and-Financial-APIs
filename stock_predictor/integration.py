"""
Load Yahoo Finance OHLCV + optional macro context, then run the multi-model pipeline.

Used by the main FastAPI app for `/multi-model/predict`.
"""

from __future__ import annotations

import pandas as pd

from stock_predictor.data.pipeline import DataBundle
from stock_predictor.data.sample_data import mock_market_context_row
from stock_predictor.run_pipeline import run_prediction_pipeline
from stock_predictor.services.news_fetch import fetch_company_news

# ~6 calendar months is often 124–128 sessions; models need seq 60 + training rows (~90+).
_MIN_OHLCV_ROWS = 110


def _normalize_ohlcv(df: pd.DataFrame, symbol: str) -> pd.DataFrame:
    if isinstance(df.columns, pd.MultiIndex):
        if symbol in df.columns.get_level_values(1):
            df = df.xs(symbol, axis=1, level=1)
        else:
            df = df.iloc[:, :6]
    df = df.copy()
    df.columns = [str(c).lower().replace(" ", "_") for c in df.columns]
    keep = [c for c in ("open", "high", "low", "close", "volume") if c in df.columns]
    if len(keep) < 5:
        raise ValueError("OHLCV columns missing after download")
    out = df[keep].dropna(how="any")
    return out


def ohlcv_from_yfinance(symbol: str, period: str = "2y") -> pd.DataFrame:
    import yfinance as yf

    raw = yf.download(
        symbol,
        period=period,
        progress=False,
        auto_adjust=True,
        threads=False,
    )
    if raw is None or raw.empty:
        raise ValueError(f"No price data for {symbol}")
    df = _normalize_ohlcv(raw, symbol)
    if len(df) < _MIN_OHLCV_ROWS:
        raise ValueError(
            f"Need at least {_MIN_OHLCV_ROWS} trading days for multi-model features, got {len(df)}. "
            "Try period 1y or longer if this is a short history."
        )
    return df


def market_context_live(seed: int = 0) -> pd.Series:
    """Prefer live SPX/VIX; fall back to synthetic row."""
    try:
        import yfinance as yf

        spx = yf.download("^GSPC", period="6mo", progress=False, auto_adjust=True, threads=False)
        vix = yf.download("^VIX", period="1mo", progress=False, auto_adjust=True, threads=False)
        if spx.empty or vix.empty:
            raise ValueError("macro download empty")
        spx_c = spx["Close"] if "Close" in spx.columns else spx.iloc[:, -1]
        vix_c = vix["Close"] if "Close" in vix.columns else vix.iloc[:, -1]
        spx_c = spx_c.squeeze()
        vix_c = vix_c.squeeze()
        r20 = float(spx_c.pct_change(20).iloc[-1])
        v = float(vix_c.iloc[-1])
        pos = (spx_c.pct_change().iloc[-20:] > 0).mean()
        return pd.Series(
            {
                "index_return_20d": r20,
                "vix_level": v,
                "sector_strength": 0.0,
                "breadth": float(pos),
            }
        )
    except Exception:
        return mock_market_context_row(seed)


def build_bundle_for_symbol(
    symbol: str,
    period: str = "2y",
    use_live_context: bool = True,
) -> DataBundle:
    ohlcv = ohlcv_from_yfinance(symbol, period=period)
    headlines, _articles = fetch_company_news(symbol)
    ctx = market_context_live(seed=hash(symbol) % 10_000) if use_live_context else mock_market_context_row(42)
    return DataBundle(symbol=symbol.upper(), ohlcv=ohlcv, news_headlines=headlines, market_context=ctx)


def predict_for_symbol(
    symbol: str,
    period: str = "2y",
    *,
    chart_epochs: int = 4,
    use_live_context: bool = True,
) -> dict:
    bundle = build_bundle_for_symbol(symbol, period=period, use_live_context=use_live_context)
    return run_prediction_pipeline(bundle, chart_epochs=chart_epochs)
