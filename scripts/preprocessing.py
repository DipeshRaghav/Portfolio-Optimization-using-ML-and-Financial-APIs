import yfinance as yf
import pandas as pd
import numpy as np
import os

TICKERS = ["AAPL", "MSFT", "GOOGL", "TSLA"]

# -------------------------------
# 1. Fetch Data
# -------------------------------
def fetch_stock_data(start="2018-01-01", end="2024-01-01"):
    print("Fetching stock data...")

    data = yf.download(
        TICKERS,
        start=start,
        end=end,
        auto_adjust=True
    )

    prices = data["Close"]
    return prices


# -------------------------------
# 2. Clean Data
# -------------------------------
def clean_data(df):
    print("Cleaning missing values...")
    df = df.ffill()
    df = df.bfill()
    return df


# -------------------------------
# 3. Compute Returns
# -------------------------------
def compute_returns(df):
    print("Calculating daily returns...")
    returns = df.pct_change()
    returns = returns.dropna()
    return returns


# -------------------------------
# 4. Save Processed Data (FIXED)
# -------------------------------
def save_processed_data(prices, returns):
    print("Saving processed data...")

    os.makedirs("data/processed", exist_ok=True)

    for stock in prices.columns:

        # Ensure alignment
        close_series = prices[stock]
        return_series = returns[stock]

        stock_df = pd.DataFrame({
            "Close": close_series,
            "Return": return_series
        })

        stock_df = stock_df.dropna()
        # ✅ Save BOTH Close + Return
        stock_df = pd.DataFrame({
            "Close": prices[stock],
            "Return": returns[stock]
        })

        # Remove NaN values

        stock_df = stock_df.dropna()

        output_path = f"data/processed/{stock}_clean.csv"
        stock_df.to_csv(output_path)

        print(f"Saved: {output_path}")

# -------------------------------
# 5. Main Preprocessing Function
# -------------------------------
def preprocess():

    prices = fetch_stock_data()
    prices = clean_data(prices)

    returns = compute_returns(prices)

    save_processed_data(prices, returns)

    return prices, returns


# -------------------------------
# 6. Run Script
# -------------------------------
if __name__ == "__main__":

    prices, returns = preprocess()

    print("\nData Shapes")
    print("-------------------")
    print("Prices:", prices.shape)
    print("Returns:", returns.shape)

    print("\nSample Returns Data:")
    print(returns.head())