import pandas as pd
import numpy as np
import os

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor

DATA_PATH = "data/processed"

# 🔹 STEP 1: Load Data
def load_all_data():
    all_data = []

    for file in os.listdir(DATA_PATH):
        if file.endswith(".csv"):
            file_path = os.path.join(DATA_PATH, file)
            df = pd.read_csv(file_path)

            if "Close" not in df.columns or "Return" not in df.columns:
                continue

            stock_name = file.split("_")[0]
            df["Stock"] = stock_name
            all_data.append(df)

    return pd.concat(all_data, ignore_index=True)


# 🔹 STEP 2: Feature Engineering
def create_features(data):
    data = data.copy()

    data["MA10"] = data["Close"].rolling(10).mean()
    data["MA20"] = data["Close"].rolling(20).mean()
    data["Volatility"] = data["Return"].rolling(10).std()
    data["Momentum"] = data["Close"] - data["Close"].shift(10)

    data = data.dropna()

    X = data[["MA10", "MA20", "Volatility", "Momentum"]]
    y = data["Return"]

    return X, y, data


# 🔹 STEP 3: Train Model
def train_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(
        n_estimators=150,
        max_depth=6,
        random_state=42
    )

    model.fit(X_train, y_train)
    return model


# 🔹 STEP 4: Generate Predictions
def generate_predictions(model, data):
    predictions = []

    for stock in data["Stock"].unique():
        stock_data = data[data["Stock"] == stock]

        X = stock_data[["MA10", "MA20", "Volatility", "Momentum"]].iloc[-1:]
        predicted_return = model.predict(X)[0]
        current_return = stock_data["Return"].iloc[-1]

        signal = "BUY" if predicted_return > 0 else "SELL"

        predictions.append({
            "stock": stock,
            "predicted_return": float(predicted_return),
            "current_return": float(current_return),
            "signal": signal
        })

    return sorted(predictions, key=lambda x: x["predicted_return"], reverse=True)


# 🔥 FINAL FUNCTION (THIS IS WHAT WE NEED)
def get_stock_predictions():
    data = load_all_data()
    X, y, processed_data = create_features(data)
    model = train_model(X, y)
    predictions = generate_predictions(model, processed_data)

    return predictions