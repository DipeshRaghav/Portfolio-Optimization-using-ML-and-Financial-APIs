"""
End-to-end orchestration: data → five models → ensemble → risk → optional backtest summary.

Usage:
    python -m stock_predictor.run_pipeline
"""

from __future__ import annotations

import json
from typing import Any, Dict

import pandas as pd

from stock_predictor.backtesting.simulator import BacktestConfig, run_backtest
from stock_predictor.data.pipeline import DataBundle, build_data_bundle
from stock_predictor.ensemble.combiner import EnsembleCombiner
from stock_predictor.models.chart_model import ChartLSTMModel
from stock_predictor.models.historical_model import HistoricalRFModel
from stock_predictor.models.indicator_model import IndicatorXGBModel
from stock_predictor.models.market_model import MarketContextModel
from stock_predictor.models.sentiment_model import SentimentTransformerModel
from stock_predictor.risk_engine.engine import PortfolioRiskEngine
from stock_predictor.utils.config import ModelConfig


def run_prediction_pipeline(
    bundle: DataBundle,
    *,
    chart_epochs: int = 8,
) -> Dict[str, Any]:
    ohlcv = bundle.ohlcv.copy()
    ohlcv.columns = [c.lower() for c in ohlcv.columns]

    chart = ChartLSTMModel(seq_len=ModelConfig().sequence_length)
    indicator = IndicatorXGBModel()
    sentiment = SentimentTransformerModel()
    historical = HistoricalRFModel()
    market = MarketContextModel()

    chart.fit(ohlcv, epochs=chart_epochs)
    out_chart = chart.predict(ohlcv)
    out_ind = indicator.predict(ohlcv)
    headlines = bundle.news_headlines or []
    out_sent = sentiment.score_headlines(headlines if headlines else ["neutral market tone"])
    out_hist = historical.predict(ohlcv)

    market.fit(ohlcv, bundle.market_context)
    out_mkt = market.predict(ohlcv, bundle.market_context)

    combiner = EnsembleCombiner()
    ens = combiner.combine(
        chart=out_chart["prob_up"],
        indicator=out_ind["prob_up"],
        sentiment=out_sent["prob_up"],
        historical=out_hist["prob_up"],
        market=out_mkt["prob_up"],
    )

    port_ret = ohlcv["close"].pct_change().dropna()
    risk = PortfolioRiskEngine().evaluate(
        returns=port_ret,
        weights={bundle.symbol: 1.0},
        signal_strength=ens.final_score,
    )

    # Simplified backtest: full-period long if ensemble says "buy", else cash
    signal_const = pd.Series(
        1.0 if ens.signal == "buy" else 0.0,
        index=ohlcv.index,
    )
    bt = run_backtest(ohlcv["close"], signal_const, BacktestConfig())

    return {
        "symbol": bundle.symbol,
        "models": {
            "chart": out_chart,
            "indicator": out_ind,
            "sentiment": {k: v for k, v in out_sent.items() if k != "raw_score"},
            "historical": out_hist,
            "market": out_mkt,
        },
        "ensemble": {
            "final_score": ens.final_score,
            "confidence": ens.confidence,
            "signal": ens.signal,
            "breakdown": ens.breakdown,
        },
        "risk": {
            "portfolio_vol_annual": risk.portfolio_vol_annual,
            "var_historical": risk.var_historical,
            "max_drawdown": risk.max_drawdown,
            "risk_score": risk.risk_score,
            "suggestions": risk.suggestions,
        },
        "backtest": {
            "total_return": bt.total_return,
            "sharpe": bt.sharpe,
            "win_rate": bt.win_rate,
            "max_drawdown": bt.max_drawdown,
            "note": "Constant long/cash from final ensemble signal (demo; not walk-forward).",
        },
    }


def main():
    bundle = build_data_bundle(symbol="DEMO", n_days=600, seed=42)
    result = run_prediction_pipeline(bundle)
    print(json.dumps(result, indent=2, default=str))


if __name__ == "__main__":
    main()
