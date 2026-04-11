import numpy as np
import pandas as pd
from scipy.optimize import minimize 
import os

print("Loading predicted returns...")

# ==============================
# LOAD DATA
# ==============================
pred = pd.read_csv("results/predicted_returns.csv")

stocks = pred["Stock"].values
returns = pred["Predicted_Return"].values

n = len(stocks)

# ==============================
# CALCULATE VOLATILITY
# ==============================
def calculate_volatility():
    vol_data = {}

    data_path = "data/processed"

    # Check if folder exists
    if not os.path.exists(data_path):
        print("Processed data folder not found")
        return vol_data

    for file in os.listdir(data_path):
        if file.endswith(".csv"):  # Only read CSV files
            stock = file.split("_")[0]
            file_path = os.path.join(data_path, file)

            df = pd.read_csv(file_path)

            # Ensure 'Return' column exists
            if "Return" in df.columns:
                vol = df["Return"].std()

                # Avoid NaN values
                if pd.notna(vol):
                    vol_data[stock] = vol

    return vol_data
# ==============================
# ADD VOLATILITY TO DATA
# ==============================

vol_dict = calculate_volatility()

# Map volatility to each stock
pred["Volatility"] = pred["Stock"].map(vol_dict)

# Handle missing values
pred["Volatility"].fillna(pred["Volatility"].mean(), inplace=True)

# ==============================
# RISK-ADJUSTED SCORING
# ==============================

pred["Score"] = pred["Predicted_Return"] / (pred["Volatility"] + 1e-6)

# ==============================
# COVARIANCE MATRIX (from historical returns, annualized)
# ==============================
def build_annualized_covariance(stock_list):
    data_path = "data/processed"
    if not os.path.isdir(data_path):
        return None

    merged = None
    for stock in stock_list:
        path = os.path.join(data_path, f"{stock}_clean.csv")
        if not os.path.isfile(path):
            return None
        df = pd.read_csv(path, parse_dates=["Date"])
        if "Return" not in df.columns:
            return None
        part = df[["Date", "Return"]].rename(columns={"Return": stock})
        merged = part if merged is None else merged.merge(part, on="Date", how="inner")

    if merged is None or len(merged) < 30:
        return None

    rets = merged[stock_list].dropna()
    if len(rets) < 30:
        return None
    daily_cov = rets.cov().values
    return daily_cov * 252


cov_matrix = build_annualized_covariance(list(stocks))
if cov_matrix is None:
    print(
        "Warning: could not build covariance from data/processed; "
        "falling back to diagonal estimate from volatilities."
    )
    vol_map = pred.drop_duplicates("Stock").set_index("Stock")["Volatility"]
    vols = np.array([vol_map[s] for s in stocks])
    cov_matrix = np.diag(vols ** 2) * 252

# ==============================
# RISK-FREE (annual, aligns with annualized covariance)
# ==============================
risk_free_annual = 0.02


def portfolio_performance(weights):
    port_return_daily = np.dot(weights, returns)
    port_return_annual = port_return_daily * 252
    port_vol = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
    return port_return_annual, port_vol


def negative_sharpe(weights):
    port_return_annual, port_vol = portfolio_performance(weights)

    if port_vol == 0:
        return 0

    return -(port_return_annual - risk_free_annual) / port_vol

# ==============================
# CONSTRAINTS
# ==============================
constraints = ({
    'type': 'eq',
    'fun': lambda w: np.sum(w) - 1
})

# ==============================
# BOUNDS (RELAXED TO 60%)
# ==============================
bounds = tuple((0, 0.6) for _ in range(n))

# ==============================
# INITIAL WEIGHTS
# ==============================
init_weights = np.ones(n) / n

# ==============================
# OPTIMIZATION
# ==============================
print("Optimizing portfolio...")

result = minimize(
    negative_sharpe,
    init_weights,
    method='SLSQP',
    bounds=bounds,
    constraints=constraints
)

weights = result.x

# ==============================
# SAFE NORMALIZATION
# ==============================

total_weight = np.sum(weights)

if total_weight != 0:
    weights = weights / total_weight

# ==============================
# RESULTS
# ==============================
portfolio = pd.DataFrame({
    "Stock": stocks,
    "Weight": weights
})

# Sort by highest weight
portfolio = portfolio.sort_values(by="Weight", ascending=False)

# Round after sorting
portfolio["Weight"] = portfolio["Weight"].round(3)

port_return, port_vol = portfolio_performance(weights)
sharpe = (port_return - risk_free_annual) / port_vol

print("\nOptimal Portfolio Allocation:")
print(portfolio)

print(f"\nExpected Return (annualized): {port_return:.4f}")
print(f"Volatility (annualized): {port_vol:.4f}")
print(f"Sharpe Ratio: {sharpe:.4f}")

os.makedirs("results", exist_ok=True)
portfolio.to_csv("results/portfolio_weights.csv", index=False)
print("\nSaved: results/portfolio_weights.csv")
