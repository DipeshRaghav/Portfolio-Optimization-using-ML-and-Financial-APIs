import requests
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from portfolio.predictor import get_stock_predictions
from portfolio.predictor import get_market_data, get_portfolio_optimization, get_technical_indicators

app = FastAPI()

# Enable CORS 
#(for frontend connections)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict this later on
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint:
@app.get("/")
def home():
    return {"message": "Portfolio ML API is running 🚀"}

# Dynamic prediction endpoint
@app.get("/predict")
def predict(stocks: List[str] = Query(...)):
    try:
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

@app.get("/search")
def search_stock(query: str = Query(...)):
    try:
        url = f"https://query2.finance.yahoo.com/v1/finance/search?q={query}&quotesCount=5&newsCount=0"
        headers = {"User-Agent": "Mozilla/5.0"}
        r = requests.get(url, headers=headers)
        data = r.json()
        quotes = data.get("quotes", [])
        results = [{"symbol": q.get("symbol", ""), "shortname": q.get("shortname", "")} for q in quotes if q.get("quoteType") in ("EQUITY", "ETF", "MUTUALFUND", "INDEX")]
        return {"results": results[:5]}
    except Exception as e:
        return {"error": str(e)}

@app.get("/technicals")
def get_technicals(stock: str = Query(...)):
    try:
        return get_technical_indicators(stock)
    except Exception as e:
        return {"error": str(e)}
