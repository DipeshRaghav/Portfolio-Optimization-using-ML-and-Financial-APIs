import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler


TICKERS = ["AAPL", "MSFT", "GOOGL", "TSLA"]


def fetch_stock_data(start="2018-01-01", end="2024-01-01"):

    print("Fetching stock data...")

    data = yf.download(
        TICKERS,
        start=start,
        end=end,
        auto_adjust=True,
        group_by="column"
    )

    prices = data["Close"]

    return prices


def clean_data(df):

    print("Cleaning missing values...")

    df = df.ffill()
    df = df.bfill()

    return df


def compute_returns(df):

    print("Calculating daily returns...")

    returns = df.pct_change()

    returns = returns.dropna()

    return returns


def normalize_data(df):

    print("Scaling data...")

    scaler = StandardScaler()

    scaled = scaler.fit_transform(df)

    scaled_df = pd.DataFrame(
        scaled,
        columns=df.columns,
        index=df.index
    )

    return scaled_df


def split_data(df, ratio=0.8):

    print("Splitting data into train/test...")

    split = int(len(df) * ratio)

    train = df.iloc[:split]

    test = df.iloc[split:]

    return train, test


def preprocess():

    prices = fetch_stock_data()

    prices = clean_data(prices)

    returns = compute_returns(prices)

    scaled_returns = normalize_data(returns)

    train, test = split_data(scaled_returns)

    return prices, returns, train, test


if __name__ == "__main__":

    prices, returns, train, test = preprocess()

    print("\nData Shapes")
    print("-------------------")

    print("Prices:", prices.shape)
    print("Returns:", returns.shape)
    print("Train:", train.shape)
    print("Test:", test.shape)

    print("\nFirst few rows of returns:")
    print(returns.head())