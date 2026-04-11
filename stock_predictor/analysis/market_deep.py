"""Extended macro context: recent SPX / VIX series for UI charts."""

from __future__ import annotations

from typing import Any, Dict, List

import pandas as pd


def market_series_for_chart(period: str = "6mo") -> Dict[str, Any]:
    try:
        import yfinance as yf

        spx = yf.download("^GSPC", period=period, progress=False, auto_adjust=True, threads=False)
        vix = yf.download("^VIX", period=period, progress=False, auto_adjust=True, threads=False)
        spx_c = spx["Close"].squeeze() if "Close" in spx.columns else spx.iloc[:, -1].squeeze()
        vix_c = vix["Close"].squeeze() if "Close" in vix.columns else vix.iloc[:, -1].squeeze()

        def ser_to_list(s: pd.Series, cap: int = 300) -> List[Dict[str, Any]]:
            s = s.dropna().iloc[-cap:]
            return [
                {"date": (i.isoformat() if hasattr(i, "isoformat") else str(i)), "value": float(v)}
                for i, v in s.items()
            ]

        return {
            "spx": ser_to_list(spx_c),
            "vix": ser_to_list(vix_c),
            "spx_return_20d": float(spx_c.pct_change(20).iloc[-1]) if len(spx_c) > 21 else None,
            "vix_latest": float(vix_c.iloc[-1]) if len(vix_c) else None,
        }
    except Exception as e:
        return {"error": str(e), "spx": [], "vix": []}
