from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from portfolio.predictor import get_stock_predictions
from portfolio.predictor import get_market_data

app = FastAPI()

# Enable CORS (for frontend connection):
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
def predict(stocks: List[str] = Query(default=None)):
    try:
        results = get_stock_predictions()

        # Filter results if stocks are provided
        if stocks:
            results = [r for r in results if r["stock"] in stocks]

        return {"predictions": results}

    except Exception as e:
        return {"error": str(e)}
@app.get("/market-data")
def market_data(stocks: List[str] = Query(...)):
    try:
        # Handle comma-separated input
        if len(stocks) == 1:
            stocks = stocks[0].split(",")

        stocks = [s.upper() for s in stocks]

        return get_market_data(stocks)

    except Exception as e:
        return {"error": str(e)}
