"""Extended macro context: recent SPX / VIX series for UI charts."""

from __future__ import annotations

from typing import Any, Dict, List, Tuple

import pandas as pd


def _close_series(raw: pd.DataFrame) -> pd.Series:
    s = raw["Close"].squeeze() if "Close" in raw.columns else raw.iloc[:, -1].squeeze()
    return s


def _ser_to_list(s: pd.Series, cap: int = 300) -> List[Dict[str, Any]]:
    s = s.dropna().iloc[-cap:]
    return [
        {"date": (i.isoformat() if hasattr(i, "isoformat") else str(i)), "value": float(v)}
        for i, v in s.items()
    ]


def download_spx_vix_closes(period: str = "1y") -> Tuple[pd.Series, pd.Series]:
    import yfinance as yf

    spx = yf.download("^GSPC", period=period, progress=False, auto_adjust=True, threads=False)
    vix = yf.download("^VIX", period=period, progress=False, auto_adjust=True, threads=False)
    if spx is None or vix is None or spx.empty or vix.empty:
        raise ValueError("macro index download empty")
    return _close_series(spx), _close_series(vix)


def context_series_from_closes(spx_c: pd.Series, vix_c: pd.Series) -> pd.Series:
    r20 = float(spx_c.pct_change(20).iloc[-1]) if len(spx_c) > 21 else 0.0
    v = float(vix_c.iloc[-1]) if len(vix_c) else 20.0
    pos = float((spx_c.pct_change().iloc[-20:] > 0).mean()) if len(spx_c) >= 20 else 0.5
    return pd.Series(
        {
            "index_return_20d": r20,
            "vix_level": v,
            "sector_strength": 0.0,
            "breadth": pos,
        }
    )


def chart_payload_from_closes(spx_c: pd.Series, vix_c: pd.Series) -> Dict[str, Any]:
    return {
        "spx": _ser_to_list(spx_c),
        "vix": _ser_to_list(vix_c),
        "spx_return_20d": float(spx_c.pct_change(20).iloc[-1]) if len(spx_c) > 21 else None,
        "vix_latest": float(vix_c.iloc[-1]) if len(vix_c) else None,
    }


def load_macro_bundle(period: str = "1y", *, seed: int = 0) -> Tuple[pd.Series, Dict[str, Any]]:
    """
    Single SPX/VIX download for both market model context and chart payload.
    Falls back like integration.market_context_live on failure.
    """
    from stock_predictor.data.sample_data import mock_market_context_row

    try:
        spx_c, vix_c = download_spx_vix_closes(period)
        ctx = context_series_from_closes(spx_c, vix_c)
        chart = chart_payload_from_closes(spx_c, vix_c)
        return ctx, chart
    except Exception as e:
        return mock_market_context_row(seed), {"error": str(e), "spx": [], "vix": []}


def market_series_for_chart(period: str = "6mo") -> Dict[str, Any]:
    try:
        spx_c, vix_c = download_spx_vix_closes(period)
        return chart_payload_from_closes(spx_c, vix_c)
    except Exception as e:
        return {"error": str(e), "spx": [], "vix": []}
