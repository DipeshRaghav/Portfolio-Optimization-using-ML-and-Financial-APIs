import yfinance as yf
import pandas as pd
import os
import logging
import requests
from datetime import datetime

# ---------------- CONFIG ---------------- #
OUTPUT_FOLDER = "data/raw"
DEFAULT_STOCKS = ["AAPL", "MSFT", "GOOGL", "TSLA"]
START_DATE = "2022-01-01"
END_DATE = datetime.today().strftime("%Y-%m-%d")

# Logging setup
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")


# ---------------- UTIL FUNCTIONS ---------------- #

def create_output_folder():
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)


def search_stock(query):
    """Fetch stock suggestions from Yahoo Finance"""
    try:
        url = "https://query1.finance.yahoo.com/v1/finance/search"
        params = {"q": query}

        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        response = requests.get(url, headers=headers, params=params, timeout=5)

        if response.status_code != 200:
            logging.error(f"Search API request failed: {response.status_code}")
            return []

        try:
            data = response.json()
        except Exception:
            logging.error("Invalid JSON response from search API")
            return []

        results = data.get("quotes", [])

        suggestions = []
        for item in results:
            symbol = item.get("symbol")
            name = item.get("shortname", "N/A")

            if symbol:
                suggestions.append((symbol, name))

        return suggestions

    except Exception as e:
        logging.error(f"Search API failed: {e}")
        return []


def get_user_stocks():
    """Get stock tickers from user (with suggestions)"""
    user_input = input(
        "Enter stock name/ticker (comma separated) or press Enter for default: "
    ).strip()

    if not user_input:
        logging.info("Using default stocks")
        return DEFAULT_STOCKS

    final_tickers = []

    inputs = [item.strip() for item in user_input.split(",")]

    for query in inputs:
        suggestions = search_stock(query)

        if not suggestions:
            logging.warning(f"No suggestions found for '{query}'")
            continue

        print(f"\nSuggestions for '{query}':")
        for i, (symbol, name) in enumerate(suggestions[:5], start=1):
            print(f"{i}. {symbol} - {name}")

        choice = input("Select option number (or press Enter to skip): ")

        if choice.isdigit():
            index = int(choice) - 1
            if 0 <= index < len(suggestions):
                selected_symbol = suggestions[index][0]
                final_tickers.append(selected_symbol)
                logging.info(f"Selected: {selected_symbol}")

    return final_tickers


def fetch_stock_data(ticker):
    """Fetch stock data"""
    try:
        data = yf.download(ticker, start=START_DATE, end=END_DATE)

        # Fix index
        data.reset_index(inplace=True)

        # Flatten multi-index columns
        if isinstance(data.columns, pd.MultiIndex):
            data.columns = data.columns.get_level_values(0)

        if data.empty:
            logging.warning(f"No data found for {ticker}")
            return None

        return data

    except Exception as e:
        logging.error(f"Failed to fetch {ticker}: {e}")
        return None


def save_data(ticker, data):
    """Save data to CSV"""
    file_path = os.path.join(OUTPUT_FOLDER, f"{ticker}.csv")
    data.to_csv(file_path, index=False)
    logging.info(f"Saved {ticker} data to {file_path}")


# ---------------- MAIN ---------------- #

def main():
    logging.info("=== Data Ingestion Started ===")

    create_output_folder()

    stocks = get_user_stocks()

    if not stocks:
        logging.warning("No valid stocks selected. Exiting.")
        return

    for ticker in stocks:
        logging.info(f"Processing {ticker}...")

        data = fetch_stock_data(ticker)

        if data is not None:
            save_data(ticker, data)

    logging.info("=== Data Ingestion Completed ===")


if __name__ == "__main__":
    main()