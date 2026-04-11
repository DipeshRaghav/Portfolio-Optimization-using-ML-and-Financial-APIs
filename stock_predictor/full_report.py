"""
Single entrypoint for UI: pipeline + reasons + price/forecast series + news + macro depth.
"""

from __future__ import annotations

from typing import Any, Dict

import pandas as pd

from stock_predictor.analysis.forecast_path import forecast_continuation, price_history_json
from stock_predictor.analysis.history_triggers import build_trigger_timeline
from stock_predictor.analysis.market_deep import market_series_for_chart
from stock_predictor.analysis.reasoning import (
    chart_reasons,
    historical_reasons,
    market_reasons,
    technical_reasons,
)
from stock_predictor.data.pipeline import DataBundle
from stock_predictor.integration import ohlcv_from_yfinance, market_context_live
from stock_predictor.run_pipeline import run_prediction_pipeline
from stock_predictor.services.news_fetch import fetch_company_news


def run_full_report(
    symbol: str,
    period: str = "2y",
    *,
    chart_epochs: int = 4,
) -> Dict[str, Any]:
    symbol = symbol.upper().strip()
    headlines, articles = fetch_company_news(symbol)
    ohlcv = ohlcv_from_yfinance(symbol, period=period)
    ctx = market_context_live(seed=hash(symbol) % 10_000)
    bundle = DataBundle(
        symbol=symbol,
        ohlcv=ohlcv,
        news_headlines=headlines,
        market_context=ctx,
    )

    base = run_prediction_pipeline(bundle, chart_epochs=chart_epochs)
    c = ohlcv.copy()
    c.columns = [x.lower() for x in c.columns]
    close = c["close"]

    ens = base["ensemble"]
    final_score = float(ens["final_score"])

    models = base["models"]
    chart_r = chart_reasons(ohlcv, models["chart"])
    tech_r = technical_reasons(ohlcv)
    hist_r = historical_reasons(ohlcv, models["historical"])
    mkt_r = market_reasons(bundle.market_context, models["market"])

    hist = price_history_json(close)
    fc = forecast_continuation(close, final_score, horizon=10)
    triggers = build_trigger_timeline(ohlcv, articles)
    macro = market_series_for_chart(period="1y")

    return {
        **base,
        "period": period,
        "chart_epochs": chart_epochs,
        "news_articles": articles,
        "reasons": {
            "chart": chart_r,
            "technical": tech_r,
            "historical": hist_r,
            "market": mkt_r,
        },
        "price_history": hist,
        "forecast": fc,
        "chart_series": hist + fc,
        "history_triggers": triggers,
        "market_analysis": macro,
    }
