"""
FastAPI app: POST JSON with OHLCV rows + headlines + market context → ensemble output.

Run: uvicorn stock_predictor.api.main:app --reload
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from stock_predictor.data.pipeline import DataBundle
from stock_predictor.run_pipeline import run_prediction_pipeline

app = FastAPI(title="Stock Predictor API", version="0.1.0")


class OHLCVRow(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: float


class PredictRequest(BaseModel):
    symbol: str = "DEMO"
    ohlcv: List[OHLCVRow]
    news_headlines: Optional[List[str]] = None
    market_context: Optional[Dict[str, float]] = None


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(req: PredictRequest) -> Dict[str, Any]:
    if len(req.ohlcv) < 120:
        raise HTTPException(400, "Need at least ~120 OHLCV rows for stable features.")
    rows = [r.model_dump() if hasattr(r, "model_dump") else r.dict() for r in req.ohlcv]
    df = pd.DataFrame(rows)
    df["date"] = pd.to_datetime(df["date"])
    df = df.set_index("date")
    df = df.rename(
        columns={
            "open": "open",
            "high": "high",
            "low": "low",
            "close": "close",
            "volume": "volume",
        }
    )
    ctx = req.market_context or {}
    mc = pd.Series(
        {
            "index_return_20d": ctx.get("index_return_20d", 0.02),
            "vix_level": ctx.get("vix_level", 18.0),
            "sector_strength": ctx.get("sector_strength", 0.0),
            "breadth": ctx.get("breadth", 0.5),
        }
    )
    bundle = DataBundle(
        symbol=req.symbol,
        ohlcv=df,
        news_headlines=req.news_headlines or [],
        market_context=mc,
    )
    return run_prediction_pipeline(bundle)


def create_app():
    return app
