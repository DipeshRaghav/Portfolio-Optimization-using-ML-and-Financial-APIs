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

    # ✅ Fix multi-index issue
    prices = data["Close"].copy()
    prices.columns.name = None

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
# 4. Save Processed Data
# -------------------------------
def save_processed_data(prices, returns):
    print("Saving processed data...")

    os.makedirs("data/processed", exist_ok=True)

    for stock in returns.columns:

        # Skip if stock missing in prices
        if stock not in prices.columns:
            print(f"Skipping {stock} (no Close data)")
            continue

        close_series = prices[stock]
        return_series = returns[stock]

        # Combine safely
        stock_df = pd.concat([close_series, return_series], axis=1)
        stock_df.columns = ["Close", "Return"]

        stock_df = stock_df.dropna()

        # Skip empty data
        if stock_df.empty:
            print(f"Skipping {stock} (empty after cleaning)")
            continue

        print(f"{stock} shape:", stock_df.shape)

        output_path = f"data/processed/{stock}_clean.csv"
        stock_df.to_csv(output_path)

        print(f"Saved: {output_path}")


# -------------------------------
# 5. Main Preprocessing Function
# -------------------------------
def preprocess():

    prices = fetch_stock_data()

    # ✅ Clean data
    prices = clean_data(prices)

    # ✅ Ensure numeric (important for ML)
    prices = prices.apply(pd.to_numeric, errors='coerce')

    # ✅ Sort index (time order)
    prices = prices.sort_index()

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