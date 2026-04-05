from fastapi import FastAPI
from portfolio.predictor import get_stock_predictions

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Portfolio ML API is running 🚀"}

@app.get("/predict")
def predict():
    try:
        results = get_stock_predictions()
        return {"predictions": results}
    except Exception as e:
        return {"error": str(e)}