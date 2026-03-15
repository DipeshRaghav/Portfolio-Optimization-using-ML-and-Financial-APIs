import yfinance as yf
import pandas as pd
import os

# stocks we want to download
stocks = ["AAPL", "MSFT", "GOOGL", "TSLA"]

# output folder
output_folder = "data/raw"
os.makedirs(output_folder, exist_ok=True)

for stock in stocks:
    print(f"Downloading data for {stock}...")

    data = yf.download(stock, start="2022-01-01", end="2024-01-01")

    file_path = f"{output_folder}/{stock}.csv"
    data.to_csv(file_path)

    print(f"Saved {stock} data to {file_path}")

print("Data collection complete.")