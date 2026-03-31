import pandas as pd
import os
import logging

RAW_FOLDER = "data/raw"
PROCESSED_FOLDER = "data/processed"

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

# -------------------------------
# 1. Create processed folder
# -------------------------------
def create_processed_folder():
    os.makedirs(PROCESSED_FOLDER, exist_ok=True)


# -------------------------------
# 2. Clean data
# -------------------------------
def clean_data(df):
    df = df.ffill()
    df = df.bfill()
    return df


# -------------------------------
# 3. Compute returns
# -------------------------------
def compute_returns(df):
    df["Return"] = df["Close"].pct_change()
    df = df.dropna()
    return df


# -------------------------------
# 4. Process single stock file
# -------------------------------
def process_stock(file_path):

    try:
        df = pd.read_csv(file_path)

        # Ensure required columns exist
        if "Close" not in df.columns:
            logging.warning(f"Skipping {file_path} (no Close column)")
            return None

        # Ensure Date column
        if "Date" not in df.columns:
            logging.warning(f"Skipping {file_path} (no Date column)")
            return None

        # Convert Date
        df["Date"] = pd.to_datetime(df["Date"])
        df = df.sort_values("Date")

        # Keep only required columns
        df = df[["Date", "Close"]]

        df = clean_data(df)
        df = compute_returns(df)

        return df

    except Exception as e:
        logging.error(f"Error processing {file_path}: {e}")
        return None


# -------------------------------
# 5. Save processed file
# -------------------------------
def save_processed_data(stock_name, df):

    output_path = os.path.join(PROCESSED_FOLDER, f"{stock_name}_clean.csv")
    df.to_csv(output_path, index=False)

    logging.info(f"Saved: {output_path}")


# -------------------------------
# 6. Main preprocessing
# -------------------------------
def preprocess():

    logging.info("=== Preprocessing Started ===")

    create_processed_folder()

    files = [f for f in os.listdir(RAW_FOLDER) if f.endswith(".csv")]

    if not files:
        logging.warning("No raw data files found.")
        return

    for file in files:

        stock_name = file.split(".")[0]
        file_path = os.path.join(RAW_FOLDER, file)

        logging.info(f"Processing {stock_name}...")

        df = process_stock(file_path)

        if df is not None and not df.empty:
            save_processed_data(stock_name, df)
        else:
            logging.warning(f"Skipping {stock_name} (empty data)")

    logging.info("=== Preprocessing Completed ===")


# -------------------------------
# 7. Run
# -------------------------------
if __name__ == "__main__":
    preprocess()