"""Timeline of volatility spikes + news items as 'prediction triggers' (retrospective)."""

from __future__ import annotations

from typing import Any, Dict, List

import pandas as pd


def build_trigger_timeline(
    ohlcv: pd.DataFrame,
    articles: List[Dict[str, Any]],
    max_events: int = 40,
) -> List[Dict[str, Any]]:
    df = ohlcv.copy()
    df.columns = [c.lower() for c in df.columns]
    c = df["close"]
    ret = c.pct_change()
    vol20 = ret.rolling(20).std()
    events: List[Dict[str, Any]] = []

    # Volatility triggers (last 120 sessions)
    tail = df.iloc[-120:]
    r = tail["close"].pct_change()
    v = r.rolling(20).std()
    for i in range(20, len(tail)):
        if pd.isna(v.iloc[i]):
            continue
        z = abs(r.iloc[i]) / (v.iloc[i] + 1e-12)
        if z > 2.5:
            idx = tail.index[i]
            ts = idx.isoformat() if hasattr(idx, "isoformat") else str(idx)
            events.append(
                {
                    "date": ts,
                    "type": "volatility",
                    "title": f"Large move |z|={z:.1f}σ vs 20d vol",
                    "detail": f"Daily return {r.iloc[i]*100:+.2f}%",
                }
            )

    # News triggers
    for a in articles:
        events.append(
            {
                "date": a.get("published", ""),
                "type": "news",
                "title": a.get("title", ""),
                "detail": a.get("publisher", ""),
                "link": a.get("link", ""),
            }
        )

    # Sort by date string (best-effort)
    events.sort(key=lambda x: x.get("date") or "", reverse=True)
    return events[:max_events]
