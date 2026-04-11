import pandas as pd
import numpy as np
import os

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error

DATA_PATH = "data/processed"
OUTPUT_PATH = "results/predicted_returns.csv"

def load_all_data():
    """Load all processed stock datasets"""

    all_data = []  
    for file in os.listdir(DATA_PATH):
        if file.endswith(".csv"):

            file_path = os.path.join(DATA_PATH, file)

            df = pd.read_csv(file_path)

            if "Close" not in df.columns or "Return" not in df.columns:
                print(f"Skipping {file} (missing required columns)")
                continue

            stock_name = file.split("_")[0]
            df["Stock"] = stock_name

            all_data.append(df)

    combined_data = pd.concat(all_data, ignore_index=True)  

    print("Columns in dataset:", combined_data.columns.tolist())  

    return combined_data

def create_features(data):

    data = data.copy()

    if "Close" not in data.columns or "Return" not in data.columns:
        raise ValueError("Required columns missing (Close/Return)")

    data["MA10"] = data["Close"].rolling(10).mean()
    data["MA20"] = data["Close"].rolling(20).mean()
    data["Volatility"] = data["Return"].rolling(10).std()
    data["Momentum"] = data["Close"] - data["Close"].shift(10)

    data = data.dropna()

    for col in ["PE_Ratio", "EPS_Growth", "Revenue_Growth"]:
        if col not in data.columns:
            data[col] = 0

    X = data[["MA10", "MA20", "Volatility", "Momentum","PE_Ratio", "EPS_Growth", "Revenue_Growth"]]
    y = data["Return"]

    return X, y, data

def train_model(X, y):
    """Train ML model"""

    X_train, X_test, y_train, y_test = train_test_split(  
        X, y, test_size=0.2, random_state=42  
    )  

    model = RandomForestRegressor(
    n_estimators=150,
    max_depth=6,
    random_state=42
    )
    
    model.fit(X_train, y_train)  

    predictions = model.predict(X_test)  

    mse = mean_squared_error(y_test, predictions)  

    print("Model Training Completed")  
    print("Mean Squared Error:", mse)  

    return model  

def generate_predictions(model, data):
    """Predict expected return for each stock with reasoning"""

    predictions = []

    for stock in data["Stock"].unique():

        stock_data = data[data["Stock"] == stock]

        X = stock_data[["MA10", "MA20", "Volatility", "Momentum","PE_Ratio", "EPS_Growth", "Revenue_Growth"]].iloc[-1:]

        predicted_return = model.predict(X)[0]
        current_return = stock_data["Return"].iloc[-1]

        reason = []

        if predicted_return > 0:
            reason.append("Positive return expected")
        else:
            reason.append("Negative/low return expected")

        if stock_data["Volatility"].iloc[-1] < 0.02:
            reason.append("Low risk")
        else:
            reason.append("High volatility")

        if stock_data["MA10"].iloc[-1] > stock_data["MA20"].iloc[-1]:
            reason.append("Uptrend")
        else:
            reason.append("Downtrend")

        if predicted_return > 0.01:
            signal = "BUY"
        elif predicted_return > 0:
            signal = "HOLD"
        else:
            signal = "SELL"

        reason_text = ", ".join(reason)

        predictions.append({
            "Stock": stock,
            "Current_Return": current_return,
            "Predicted_Return": predicted_return,
            "Reason": reason_text,
            "Signal": signal
        })

    result = pd.DataFrame(predictions)
    result = result.sort_values(by="Predicted_Return", ascending=False).reset_index(drop=True)

    return result

def save_predictions(predictions):
    """Save predicted returns"""
    
    os.makedirs("results", exist_ok=True)  

    predictions.to_csv(OUTPUT_PATH, index=False)  

    print("Predictions saved to:", OUTPUT_PATH)  

if __name__ == "__main__":

    print("Loading processed datasets...")  

    data = load_all_data()  

    print("Creating ML features...")  

    X, y, processed_data = create_features(data)  

    print("Training machine learning model...")  

    model = train_model(X, y)  

    print("Generating predictions...")  

    predictions = generate_predictions(model, processed_data)  

    print(predictions.to_string(index=False))

    save_predictions(predictions)