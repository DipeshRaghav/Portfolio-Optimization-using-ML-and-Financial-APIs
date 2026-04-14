# SmartInvest - Real Time Risk Assessment System

## 📈 Portfolio Optimization — ML + Financial APIs

A full-stack app that predicts stock returns and optimizes your portfolio using Machine Learning and real-time market data.

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🚀 What It Does

- 🔍 **Search** any stock, ETF, crypto, or index (live via Yahoo Finance)
- 🤖 **Predict** expected returns using ML (Random Forest + LSTM + Sentiment)
- ⚖️ **Optimize** portfolio weights to maximize the Sharpe Ratio
- 📊 **Analyze** technical indicators — RSI, MACD, moving averages
- 📰 **Report** full AI-powered deep-dive for any single stock

---

## 🛠 Tech Stack

| Layer | Tools |
|---|---|
| Backend | Python, FastAPI, yfinance, scikit-learn, pandas, scipy |
| Frontend | React, Vite, Recharts, lucide-react, react-router-dom |

---

## 📁 Structure

```
├── main.py              # All API routes (FastAPI)
├── requirements.txt     # Python deps
├── frontend/            # React + Vite app
├── models/              # Saved ML models
├── data/                # Cached stock data
├── scripts/             # Utility scripts
└── results/             # Backtest outputs
```

---

## ⚡ Quick Start

### Backend
```bash
git clone https://github.com/DipeshRaghav/Portfolio-Optimization-using-ML-and-Financial-APIs.git
cd Portfolio-Optimization-using-ML-and-Financial-APIs

python -m venv venv && source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
API → `http://localhost:8000`  &nbsp;&nbsp; Docs → `http://localhost:8000/docs`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App → `http://localhost:5173`

---

## 🔌 API Endpoints

| Endpoint | Description |
|---|---|
| `GET /` | Health check |
| `GET /search?query=AAPL` | Search stock symbols |
| `GET /predict?stocks=AAPL,GOOG` | ML return predictions |
| `GET /market-data?stocks=AAPL&period=1y` | Historical OHLCV data |
| `GET /optimize?stocks=AAPL,TSLA,MSFT` | Portfolio weights + Sharpe Ratio |
| `GET /technicals?stock=AAPL` | RSI, MACD, indicators |
| `GET /multi-model/predict?stocks=AAPL` | Ensemble model prediction |
| `GET /multi-model/full-report?symbol=AAPL` | Full AI analysis report |

**Valid periods:** `6mo` `1y` `2y` `5y` `ytd` `max`

---

## 🧱 System Architecture

The system follows a full-stack architecture:

Frontend (React)  
↓  
API Layer (FastAPI)  
↓  
Machine Learning Layer (Random Forest, LSTM, Sentiment)  
↓  
Data Layer (yfinance + processed datasets)

Flow:
1. User inputs stock symbols
2. Backend fetches real-time & historical data
3. ML models generate predictions
4. Portfolio optimization calculates weights
5. Results are visualized in the frontend

---

## 🔄 Workflow

1. 📥 Fetch stock data using Yahoo Finance API  
2. 🧹 Preprocess data (returns, indicators, features)  
3. 🤖 Train ML models (Random Forest, LSTM)  
4. 📈 Predict expected returns  
5. ⚖️ Optimize portfolio using Sharpe Ratio  
6. 📊 Display insights via dashboard  

---

## 📊 Scoring Metrics

| Metric | Good Value | Meaning |
|---|---|---|
| Sharpe Ratio | > 1.0 | Return per unit of risk |
| RSI | 30–70 | < 30 oversold · > 70 overbought |
| Expected Return | Higher = better | Predicted annualized gain |
| Volatility | Lower = stable | How much the portfolio swings |

---

## 🐛 Common Issues

**Backend won't start** → Check Python ≥ 3.10 and venv is activated  
**Frontend can't reach API** → Ensure backend is running on port 8000  
**503 on `/multi-model`** → Install `stock_predictor` extra deps  
**No data from yfinance** → Verify ticker using `/search` first

---
## 📚 Key Learnings

- Applied ML models to real financial data  
- Learned portfolio optimization techniques  
- Built full-stack system with real-time APIs  
- Improved UI/UX for data-heavy applications

---

## 👥 Team Contributions

- Dipesh → Api Integration, Deployment & Project Lead 
- Bhawna → Data preprocessing & Frontend development 
- Ishika → ML Model trained & UI/UX
- Vinay → Data processing, API development & Frontend 
- Vanshika → Optimization & Testing  
- Utsah → Evaluation & Documentation

---

> ⚠️ **Disclaimer:** For educational purposes only. Not financial advice.

---


