import pandas as pd
import numpy as np
import os

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
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

            stock_name = file.split("_")[0]  
            df["Stock"] = stock_name  

            all_data.append(df)  

    combined_data = pd.concat(all_data, ignore_index=True)  

    print("Columns in dataset:", combined_data.columns.tolist())  

    return combined_data

def create_features(data):
    """Generate ML features"""

    data["MA10"] = data["Return"].rolling(window=10).mean()  
    data["Volatility"] = data["Return"].rolling(window=10).std()  

    data = data.dropna()  

    X = data[["MA10", "Volatility"]]  
    y = data["Return"]  

    return X, y, data  

def train_model(X, y):
    """Train ML model"""

    X_train, X_test, y_train, y_test = train_test_split(  
        X, y, test_size=0.2, random_state=42  
    )  

    model = LinearRegression()  
    model.fit(X_train, y_train)  

    predictions = model.predict(X_test)  

    mse = mean_squared_error(y_test, predictions)  

    print("Model Training Completed")  
    print("Mean Squared Error:", mse)  

    return model  

def generate_predictions(model, data):
    """Predict expected return for each stock"""

    predictions = []  

    for stock in data["Stock"].unique():  

        stock_data = data[data["Stock"] == stock]  

        X = stock_data[["MA10", "Volatility"]].iloc[-1:]  

        predicted_return = model.predict(X)[0]  

        predictions.append({  
            "Stock": stock,  
            "Predicted_Return": predicted_return  
        })  

    result = pd.DataFrame(predictions)  

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

print(predictions)  

save_predictions(predictions)