from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from portfolio.predictor import get_stock_predictions

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Portfolio ML API is running 🚀"}

@app.get("/predict")
def predict():
    return {"predictions": get_stock_predictions()}