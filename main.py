import requests
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List

# Import custom ML/finance functions from your project
from portfolio.predictor import get_stock_predictions
from portfolio.predictor import get_market_data, get_portfolio_optimization, get_technical_indicators

# Initialize FastAPI app

app = FastAPI()

_ALLOWED_MULTIMODEL_PERIODS = frozenset({"6mo", "1y", "2y", "5y", "ytd", "max"})

# -------------------- CORS CONFIGURATION --------------------
# CORS (Cross-Origin Resource Sharing) allows frontend apps 
# (React, Angular, etc.) to communicate with this backend API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict this later on
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- ROOT ENDPOINT --------------------
# Basic health check endpoint to verify API is running
@app.get("/")
def home():
    return {"message": "Portfolio ML API is running"}

# -------------------- STOCK PREDICTION ENDPOINT --------------------
# Accepts a list of stock symbols and returns ML-based predictions
@app.get("/predict")
def predict(stocks: List[str] = Query(...)):
    try:
         # Handle case where input is comma-separated (e.g., "AAPL,GOOG")
        if len(stocks) == 1:
            stocks = stocks[0].split(",")
        stocks = [s.upper() for s in stocks]
        
        return get_stock_predictions(stocks)

    except Exception as e:
        return {"error": str(e)}
@app.get("/market-data")
def market_data(stocks: List[str] = Query(...), period: str = Query(default="1mo")):
    try:
        # Handle comma-separated input
        if len(stocks) == 1:
            stocks = stocks[0].split(",")

        stocks = [s.upper() for s in stocks]

        return get_market_data(stocks, period)

    except Exception as e:
        return {"error": str(e)}

@app.get("/optimize")
def optimize_portfolio(stocks: List[str] = Query(...)):
    try:
        # Handle comma-separated input
        if len(stocks) == 1:
            stocks = stocks[0].split(",")

        stocks = [s.upper() for s in stocks]

        return get_portfolio_optimization(stocks)

    except Exception as e:
        return {"error": str(e)}

_ALLOWED_SEARCH_TYPES = frozenset(
    {"EQUITY", "ETF", "MUTUALFUND", "INDEX", "CRYPTOCURRENCY", "CURRENCY"}
)


@app.get("/search")
def search_stock(query: str = Query(..., min_length=1)):
    """
    Yahoo Finance symbol lookup: top matches for equities, ETFs, indices, crypto, etc.
    """
    try:
        q = query.strip()
        if not q:
            return {"results": []}
        url = (
            "https://query2.finance.yahoo.com/v1/finance/search"
            f"?q={requests.utils.quote(q)}&quotesCount=10&newsCount=0"
        )
        headers = {"User-Agent": "Mozilla/5.0 (compatible; PortfolioML/1.0)"}
        r = requests.get(url, headers=headers, timeout=12)
        r.raise_for_status()
        data = r.json()
        quotes = data.get("quotes") or []
        results = []
        for item in quotes:
            sym = (item.get("symbol") or "").strip()
            if not sym:
                continue
            qt = item.get("quoteType") or ""
            if qt and qt not in _ALLOWED_SEARCH_TYPES:
                continue
            name = item.get("longname") or item.get("shortname") or item.get("symbol") or sym
            exch = item.get("exchDisp") or item.get("exchange") or ""
            results.append(
                {
                    "symbol": sym,
                    "shortname": item.get("shortname") or "",
                    "longname": item.get("longname") or "",
                    "name": name,
                    "exchange": exch,
                    "quoteType": qt or "EQUITY",
                }
            )
            if len(results) >= 5:
                break
        return {"results": results}
    except Exception as e:
        return {"error": str(e), "results": []}

@app.get("/technicals")
def get_technicals(stock: str = Query(...)):
    try:
        return get_technical_indicators(stock)
    except Exception as e:
        return {"error": str(e)}


@app.get("/multi-model/predict")
def multi_model_predict(
    stocks: List[str] = Query(..., description="One or more tickers (comma-separated allowed)"),
    period: str = Query(default="2y", description="yfinance period: 6mo, 1y, 2y, 5y, ytd, max"),
    chart_epochs: int = Query(default=2, ge=1, le=12, description="LSTM training epochs (lower = faster API)"),
):
    """
    Runs the 5-vertical stock_predictor pipeline (chart LSTM, indicators, sentiment,
    historical RF, market context) + ensemble + risk + demo backtest per symbol.
    """
    if len(stocks) == 1 and "," in stocks[0]:
        stocks = [s.strip() for s in stocks[0].split(",") if s.strip()]
    stocks = [s.upper() for s in stocks]
    if not stocks:
        raise HTTPException(400, "No symbols provided")
    if len(stocks) > 5:
        raise HTTPException(400, "Maximum 5 symbols per request")
    p = period.lower().strip()
    if p not in _ALLOWED_MULTIMODEL_PERIODS:
        raise HTTPException(400, f"period must be one of: {sorted(_ALLOWED_MULTIMODEL_PERIODS)}")

    try:
        from stock_predictor.integration import predict_for_symbol
    except ImportError as e:
        raise HTTPException(
            503,
            "Multi-model package not available on this server. "
            "Install stock_predictor dependencies (see stock_predictor/requirements.txt).",
        ) from e

    results = []
    errors = []
    for sym in stocks:
        try:
            out = predict_for_symbol(sym, period=p, chart_epochs=chart_epochs)
            results.append(out)
        except Exception as ex:
            errors.append({"symbol": sym, "error": str(ex)})

    return {
        "period": p,
        "chart_epochs": chart_epochs,
        "results": results,
        "errors": errors,
    }


@app.get("/multi-model/full-report")
def multi_model_full_report(
    symbol: str = Query(..., description="Single ticker, e.g. AAPL"),
    period: str = Query(default="2y"),
    chart_epochs: int = Query(default=2, ge=1, le=12),
):
    """
    Full Multi-AI payload for the SPA: models, ensemble, risk, news articles,
    per-vertical reasons, price + forecast series, history triggers, SPX/VIX context.
    """
    p = period.lower().strip()
    if p not in _ALLOWED_MULTIMODEL_PERIODS:
        raise HTTPException(400, f"period must be one of: {sorted(_ALLOWED_MULTIMODEL_PERIODS)}")
    sym = symbol.strip().upper()
    if not sym:
        raise HTTPException(400, "symbol required")

    try:
        from stock_predictor.full_report import run_full_report
    except ImportError as e:
        raise HTTPException(
            503,
            "Multi-model package not available on this server.",
        ) from e

    try:
        return run_full_report(sym, period=p, chart_epochs=chart_epochs)
    except Exception as ex:
        raise HTTPException(500, str(ex)) from ex
