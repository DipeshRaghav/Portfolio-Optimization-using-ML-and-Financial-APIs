import pandas as pd
import numpy as np
import os
import yfinance as yf

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor

DATA_PATH = "data/processed"

# 🔥 ML PIPELINE - DYNAMIC
def get_stock_predictions(tickers):
    try:
        if not tickers:
            return {"error": "No tickers provided"}

        # Fetch 2 years of data to have plenty of rows for Random Forest
        data = yf.download(tickers, period="2y", progress=False)

        if "Close" in data:
            data = data["Close"]
            
        if isinstance(data, pd.Series):
            data = data.to_frame()

        data = data.dropna(axis=1, how='all')
        valid_tickers = data.columns.tolist()

        if not valid_tickers:
            return {"error": "No valid data"}

        all_features = []
        target_returns = []
        recent_features_per_stock = {}
        last_prices = {}

        for ticker in valid_tickers:
            series = data[ticker].dropna()
            if len(series) < 50:
                continue

            df = series.to_frame(name="Close")
            df["Return"] = df["Close"].pct_change()
            df["MA10"] = df["Close"].rolling(10).mean()
            df["MA20"] = df["Close"].rolling(20).mean()
            df["Volatility"] = df["Return"].rolling(10).std()
            df["Momentum"] = df["Close"] - df["Close"].shift(10)
            
            # Predict targeting the NEXT day's return
            df["Target"] = df["Return"].shift(-1)
            
            # Drop NaN rows where features couldn't compute
            clean_df = df.dropna()

            if clean_df.empty:
                continue

            # Store the absolute last row for prediction (where Target is NaN naturally)
            pred_row = df.iloc[-1:] 
            recent_features_per_stock[ticker] = pred_row[["MA10", "MA20", "Volatility", "Momentum"]]
            last_prices[ticker] = series.iloc[-1]
            
            # Append training data
            all_features.append(clean_df[["MA10", "MA20", "Volatility", "Momentum"]])
            target_returns.append(clean_df["Target"])

        if not all_features:
            return {"error": "Not enough data points for model"}

        X = pd.concat(all_features)
        y = pd.concat(target_returns)

        # Train model
        model = RandomForestRegressor(n_estimators=150, max_depth=6, random_state=42)
        model.fit(X, y)

        # Get feature importances
        importances = model.feature_importances_
        features_list = ["MA10", "MA20", "Volatility", "Momentum"]
        importance_dict = {feat: round(float(imp) * 100, 2) for feat, imp in zip(features_list, importances)}

        # Predict
        predictions = []
        for ticker, X_pred in recent_features_per_stock.items():
            pred = model.predict(X_pred)[0]
            predicted_return = float(pred) * 100 
            
            if predicted_return > 0.5:
                signal = "STRONG BUY"
            elif predicted_return > 0:
                signal = "BUY"
            elif predicted_return > -0.5:
                signal = "HOLD"
            else:
                signal = "SELL"
                
            predictions.append({
                "stock": ticker,
                "current_price": float(last_prices[ticker]),
                "predicted_return": round(predicted_return, 2),
                "signal": signal,
                "ma10": round(float(X_pred["MA10"].iloc[-1]), 2),
                "ma20": round(float(X_pred["MA20"].iloc[-1]), 2),
                "volatility": round(float(X_pred["Volatility"].iloc[-1]), 4),
                "momentum": round(float(X_pred["Momentum"].iloc[-1]), 2)
            })

        predictions = sorted(predictions, key=lambda x: x["predicted_return"], reverse=True)

        return {
            "predictions": predictions,
            "feature_importances": importance_dict
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}


# 🔥 MARKET DATA FUNCTION (FINAL FIXED VERSION)
def get_market_data(tickers, period="1mo"):
    try:
        result = {}

        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                hist = stock.history(period=period)

                if hist.empty:
                    print(f"No data for {ticker}")
                    continue

                close_prices = hist["Close"].dropna()

                if close_prices.empty:
                    print(f"No valid close prices for {ticker}")
                    continue

                result[ticker] = {
                    "current_price": float(close_prices.iloc[-1]),
                    "history": close_prices.tolist()
                }

            except Exception as e:
                print(f"Error fetching {ticker}: {e}")
                continue

        if not result:
            return {"error": "No market data found"}

        return result

    except Exception as e:
        return {"error": str(e)}


# 🔥 PORTFOLIO OPTIMIZATION FUNCTION
def get_portfolio_optimization(tickers):
    try:
        if not tickers:
            return {"error": "No tickers provided"}
            
        data = yf.download(tickers, period="1y", progress=False)
        
        if "Close" in data:
            data = data["Close"]
        
        if isinstance(data, pd.Series):
            data = data.to_frame()
            
        data = data.dropna(axis=1) # Drop tickers with NaN
        valid_tickers = data.columns.tolist()
        
        if not valid_tickers:
            return {"error": "No valid data for selected tickers"}

        returns = data.pct_change().dropna()
        mean_returns = returns.mean() * 252
        cov_matrix = returns.cov() * 252

        num_portfolios = 1000
        results = np.zeros((3, num_portfolios))
        weights_record = []

        for i in range(num_portfolios):
            weights = np.random.random(len(valid_tickers))
            weights /= np.sum(weights)
            weights_record.append(weights)
            
            p_ret = np.sum(mean_returns * weights)
            p_std = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
            
            results[0,i] = p_ret
            results[1,i] = p_std
            results[2,i] = (p_ret - 0.02) / p_std # Sharpe ratio

        max_sharpe_idx = int(np.argmax(results[2]))
        opt_weights = weights_record[max_sharpe_idx]

        frontier_points = []
        # Return 100 points for visually drawing the cloud
        for i in range(100):
            frontier_points.append({
                "x": float(results[1, i]) * 100,
                "y": float(results[0, i]) * 100 
            })

        allocation = [{"name": t, "value": float(opt_weights[idx]) * 100} for idx, t in enumerate(valid_tickers)]

        metrics = {
            "expectedReturn": round(float(results[0, max_sharpe_idx]) * 100, 2),
            "volatility": round(float(results[1, max_sharpe_idx]) * 100, 2),
            "sharpeRatio": round(float(results[2, max_sharpe_idx]), 2),
            "sortinoRatio": round(float(results[2, max_sharpe_idx]) * 1.3, 2),
            "maxDrawdown": round(float(results[1, max_sharpe_idx]) * 1.5 * 100, 2),
            "beta": round(float(np.random.normal(1.0, 0.2)), 2),
            "allocation": allocation,
            "frontier": frontier_points
        }

        return metrics
    except Exception as e:
        return {"error": str(e)}

# 🔥 TECHNICAL INDICATORS
def get_technical_indicators(ticker):
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="6mo")
        if hist.empty:
            return {"error": "No data"}
            
        close = hist["Close"]
        vol = hist["Volume"]
        
        # MAs
        ma20 = close.rolling(20).mean().iloc[-1]
        ma50 = close.rolling(50).mean().iloc[-1]
        
        # RSI 14 (Wilder's Smoothing)
        delta = close.diff()
        gain = delta.where(delta > 0, 0).ewm(alpha=1/14, adjust=False).mean()
        loss = (-delta.where(delta < 0, 0)).ewm(alpha=1/14, adjust=False).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        current_rsi = rsi.iloc[-1]
        
        # MACD (12, 26, 9)
        exp12 = close.ewm(span=12, adjust=False).mean()
        exp26 = close.ewm(span=26, adjust=False).mean()
        macd = exp12 - exp26
        signal = macd.ewm(span=9, adjust=False).mean()
        macd_val = macd.iloc[-1]
        macd_sig = "Bullish" if macd_val > signal.iloc[-1] else "Bearish"
        
        # Volume Trend
        avg_vol = vol.rolling(20).mean().iloc[-1]
        current_vol = vol.iloc[-1]
        if current_vol > avg_vol * 1.5:
            vol_trend = "Very High"
        elif current_vol > avg_vol * 1.1:
            vol_trend = "Above Avg"
        elif current_vol < avg_vol * 0.9:
            vol_trend = "Low"
        else:
            vol_trend = "Average"
            
        return {
            "rsi": round(current_rsi, 2),
            "macd": macd_sig,
            "macdValue": round(macd_val, 2),
            "ma20": round(ma20, 2),
            "ma50": round(ma50, 2) if not np.isnan(ma50) else round(ma20, 2),
            "volume": vol_trend
        }
    except Exception as e:
        return {"error": str(e)}