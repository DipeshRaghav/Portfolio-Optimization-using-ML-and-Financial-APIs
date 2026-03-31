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
# 3. Process single stock file
# -------------------------------
def process_stock(file_path):

    try:
        df = pd.read_csv(file_path)

        print(f"\nProcessing file: {file_path}")
        print("Columns:", df.columns.tolist())

        # Required columns check
        if "Close" not in df.columns or "Date" not in df.columns:
            logging.warning(f"Skipping {file_path} (missing Close/Date)")
            return None

        # Convert types safely
        df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
        df["Close"] = pd.to_numeric(df["Close"], errors="coerce")

        df = df.dropna()
        df = df.sort_values("Date")

        # Keep only required columns
        df = df[["Date", "Close"]]

        # Clean
        df = clean_data(df)

        # Compute return
        df["Return"] = df["Close"].pct_change()
        df = df.dropna()

        print(f"Processed shape: {df.shape}")

        return df

    except Exception as e:
        logging.error(f"Error processing {file_path}: {e}")
        return None


# -------------------------------
# 4. Save processed file
# -------------------------------
def save_processed_data(stock_name, df):

    output_path = os.path.join(PROCESSED_FOLDER, f"{stock_name}_clean.csv")

    df.to_csv(output_path, index=False)

    logging.info(f"Saved: {output_path}")


# -------------------------------
# 5. Cleanup raw folder (garbage collection)
# -------------------------------
def cleanup_raw_folder(max_files=10):

    files = [
        os.path.join(RAW_FOLDER, f)
        for f in os.listdir(RAW_FOLDER)
        if f.endswith(".csv")
    ]

    if len(files) <= max_files:
        return

    files.sort(key=os.path.getmtime)

    files_to_delete = files[:-max_files]

    for file in files_to_delete:
        os.remove(file)
        logging.info(f"Deleted old raw file: {file}")


# -------------------------------
# 6. Cleanup processed folder (optional)
# -------------------------------
def cleanup_processed_folder(max_files=10):

    files = [
        os.path.join(PROCESSED_FOLDER, f)
        for f in os.listdir(PROCESSED_FOLDER)
        if f.endswith(".csv")
    ]

    if len(files) <= max_files:
        return

    files.sort(key=os.path.getmtime)

    for file in files[:-max_files]:
        os.remove(file)
        logging.info(f"Deleted old processed file: {file}")


# -------------------------------
# 7. Main preprocessing
# -------------------------------
def preprocess():

    logging.info("=== Preprocessing Started ===")

    create_processed_folder()

    files = [f for f in os.listdir(RAW_FOLDER) if f.endswith(".csv")]

    if not files:
        logging.warning("No raw files found.")
        return

    for file in files:

        stock_name = file.split(".")[0]
        file_path = os.path.join(RAW_FOLDER, file)

        logging.info(f"Processing {stock_name}...")

        df = process_stock(file_path)

        # Save only valid data
        if df is not None and len(df) > 20:
            save_processed_data(stock_name, df)
        else:
            logging.warning(f"Skipping {stock_name} (not enough data)")

    # Garbage collection
    cleanup_raw_folder(max_files=10)
    cleanup_processed_folder(max_files=10)

    logging.info("=== Preprocessing Completed ===")


# -------------------------------
# 8. Run
# -------------------------------
if __name__ == "__main__":
    preprocess()