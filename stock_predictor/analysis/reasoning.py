"""Human-readable reasons for each model vertical (demo explainability)."""

from __future__ import annotations

from typing import Any, Dict, List

import numpy as np
import pandas as pd

from stock_predictor.features.chart_sequences import ohlcv_to_matrix
from stock_predictor.features.historical_stats import add_historical_features
from stock_predictor.features.technical import add_technical_indicators


def chart_reasons(ohlcv: pd.DataFrame, chart_out: Dict[str, Any]) -> List[str]:
    df = ohlcv.copy()
    df.columns = [c.lower() for c in df.columns]
    c = df["close"]
    reasons: List[str] = []
    prob = float(chart_out.get("prob_up", 0.5))
    reasons.append(
        f"LSTM chart model estimates P(up) ≈ {prob:.1%} from the last 60 normalized OHLCV bars."
    )
    ma10 = c.rolling(10).mean().iloc[-1]
    ma20 = c.rolling(20).mean().iloc[-1]
    last = c.iloc[-1]
    if last > ma10 > ma20:
        reasons.append("Price sits above short- and medium-term moving averages (bullish structure).")
    elif last < ma10 < ma20:
        reasons.append("Price sits below short- and medium-term moving averages (bearish structure).")
    else:
        reasons.append("Moving averages are mixed; trend is not one-sided.")
    mom = float(last / c.shift(10).iloc[-1] - 1.0) if len(c) > 10 else 0.0
    reasons.append(f"10-day momentum on close is {mom * 100:+.2f}%.")

    try:
        mat = ohlcv_to_matrix(df)
        if len(mat) > 12:
            vr = float(
                np.nanmean(np.diff(mat[-10:, 3]) / (mat[-11:-1, 3] + 1e-12))
            )
            reasons.append(
                f"Recent bar-to-bar volatility regime (mean rel. change): {vr * 100:.3f}%."
            )
    except Exception:
        pass

    return reasons


def technical_reasons(ohlcv: pd.DataFrame) -> List[str]:
    df = add_technical_indicators(ohlcv).dropna()
    if df.empty:
        return ["Not enough rows to evaluate technical indicators."]
    row = df.iloc[-1]
    rsi = float(row.get("rsi_14", 50))
    macdh = float(row.get("macd_hist", 0))
    close = float(row["close"])
    bb_u = float(row.get("bb_upper", close))
    bb_l = float(row.get("bb_lower", close))

    r: List[str] = []
    if rsi >= 70:
        r.append(f"RSI(14) is overbought at {rsi:.1f} (typically >70).")
    elif rsi <= 30:
        r.append(f"RSI(14) is oversold at {rsi:.1f} (typically <30).")
    else:
        r.append(f"RSI(14) is neutral at {rsi:.1f} (30–70 band).")

    r.append(
        "MACD histogram is "
        + ("positive (short-term momentum vs signal)." if macdh >= 0 else "negative (weakness vs signal).")
    )

    if close >= bb_u * 0.998:
        r.append("Close is near or above the upper Bollinger band (potential stretch / mean-reversion risk).")
    elif close <= bb_l * 1.002:
        r.append("Close is near or below the lower Bollinger band (possible oversold bounce zone).")
    else:
        r.append("Price trades inside the Bollinger envelope (no band tag).")

    ma10 = float(row.get("ma_10", close))
    ma50 = float(row.get("ma_50", close))
    if ma10 > ma50:
        r.append("MA10 is above MA50 — short-term trend ≥ medium-term.")
    else:
        r.append("MA10 is below MA50 — short-term trend weaker than medium-term.")

    return r


def historical_reasons(ohlcv: pd.DataFrame, hist_out: Dict[str, Any]) -> List[str]:
    df = add_historical_features(ohlcv).dropna()
    if df.empty:
        return ["Insufficient history for rolling statistics."]
    row = df.iloc[-1]
    p = float(hist_out.get("prob_up", 0.5))
    r = [
        f"Historical-features model assigns P(up) ≈ {p:.1%} using rolling returns, volatility, and momentum.",
        f"Latest 1d return: {float(row['ret_1']) * 100:+.3f}%; 20d return: {float(row['ret_20']) * 100:+.2f}%.",
        f"10d realized vol (daily): {float(row['vol_10']) * 100:.2f}% (annualized ≈ {float(row['vol_10']) * (252 ** 0.5) * 100:.1f}%).",
        f"10d momentum: {float(row['mom_10']) * 100:+.2f}%; 20d momentum: {float(row['mom_20']) * 100:+.2f}%.",
    ]
    return r


def market_reasons(ctx: pd.Series, mkt_out: Dict[str, Any]) -> List[str]:
    r20 = float(ctx.get("index_return_20d", 0))
    vix = float(ctx.get("vix_level", 20))
    br = float(ctx.get("breadth", 0.5))
    bias = float(mkt_out.get("market_bias", 0))
    prob = float(mkt_out.get("prob_up", 0.5))
    return [
        f"Market-context score maps to P(bullish regime) ≈ {prob:.1%} with bias {bias:+.2f} (−1…+1).",
        f"Broad index ~20d return (proxy): {r20 * 100:+.2f}%.",
        f"Implied fear gauge (VIX proxy level in feed): {vix:.1f}.",
        f"Market breadth proxy (up-day share): {br:.1%}.",
        "Higher VIX usually raises the bar for risk-on positioning; combine with your policy limits.",
    ]
