"""Attach a simple continuation path to the last close from ensemble score."""

from __future__ import annotations

from typing import Any, Dict, List

import numpy as np
import pandas as pd


def price_history_json(close: pd.Series, max_points: int = 400) -> List[Dict[str, Any]]:
    s = close.dropna().iloc[-max_points:]
    out: List[Dict[str, Any]] = []
    for idx, val in s.items():
        t = idx.isoformat() if hasattr(idx, "isoformat") else str(idx)
        out.append({"date": t, "close": float(val), "is_forecast": False})
    return out


def forecast_continuation(
    close: pd.Series,
    final_score: float,
    horizon: int = 10,
) -> List[Dict[str, Any]]:
    """
    Map ensemble score (0–1) into a smooth forward path (illustrative, not a price target).
    """
    last = float(close.iloc[-1])
    last_dt = close.index[-1]
    # Expected move over horizon scales with distance from 0.5
    drift_total = (float(final_score) - 0.5) * 0.12  # ±6% at extremes over horizon
    daily = (1.0 + drift_total) ** (1.0 / max(horizon, 1)) - 1.0
    bdays = pd.bdate_range(last_dt + pd.Timedelta(days=1), periods=horizon, freq="B")
    path: List[Dict[str, Any]] = []
    px = last
    for d in bdays:
        px = px * (1.0 + daily)
        path.append(
            {
                "date": d.isoformat(),
                "close": float(px),
                "is_forecast": True,
            }
        )
    return path
