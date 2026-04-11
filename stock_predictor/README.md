# Multi-vertical stock prediction & portfolio risk

Production-style layout with **five independent models**, a **weighted ensemble**, a **risk engine**, and **backtesting**.

## Layout

```text
stock_predictor/
├── data/           # Synthetic OHLCV, news, market context
├── features/       # Technicals, LSTM windows, historical stats
├── models/
│   ├── chart_model/       # LSTM on OHLCV windows
│   ├── indicator_model/   # XGBoost on indicators
│   ├── sentiment_model/   # Transformers (fallback: keyword mock)
│   ├── historical_model/  # RandomForest on rolling stats
│   └── market_model/      # Logistic / rule blend on macro features
├── ensemble/       # Weighted combiner
├── risk_engine/    # Vol, VaR, drawdown, suggestions
├── backtesting/    # Costs, Sharpe, win rate
├── api/            # FastAPI
├── dashboard/      # Placeholder for Streamlit/Dash
├── utils/
└── run_pipeline.py # CLI demo
```

## Install

From repo root (recommended: separate virtualenv):

```bash
pip install -r stock_predictor/requirements.txt
```

TensorFlow and Torch are large; for a minimal test without deep learning, temporarily comment `chart_model` usage or install CPU wheels only.

## Run full pipeline

```bash
python -m stock_predictor.run_pipeline
```

## Run API

```bash
uvicorn stock_predictor.api.main:app --reload --host 127.0.0.1 --port 8010
```

## Main app integration

The repository root `main.py` exposes **`GET /multi-model/predict`** (see `integration.py`), which the React app calls from the **Multi-AI** page (`/multimodel` route in the SPA). Deploy the backend with `stock_predictor` dependencies installed (`stock_predictor/requirements.txt` or equivalent); requests can take **30–90s** on cold start while LSTM + tree models train on downloaded OHLCV.

## Ensemble weights

Default (see `utils/config.py`):

| Model       | Weight |
|------------|--------|
| Chart      | 0.30   |
| Indicator  | 0.20   |
| Sentiment  | 0.15   |
| Historical | 0.20   |
| Market     | 0.15   |

## Notes

- Data is **synthetic** unless you wire real feeds.
- Sentiment uses **DistilBERT** SST-2 if `transformers`+`torch` load; else **keyword mock**.
- Backtest in `run_pipeline` uses a **constant** long/cash stance from the **final** signal (demo simplification).
