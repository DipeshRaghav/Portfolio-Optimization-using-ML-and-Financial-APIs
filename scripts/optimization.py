import numpy as np
import pandas as pd
from scipy.optimize import minimize

print("Loading predicted returns...")

# ==============================
# LOAD DATA
# ==============================
pred = pd.read_csv("results/predicted_returns.csv")

stocks = pred["Stock"].values
returns = pred["Predicted_Return"].values

n = len(stocks)

# ==============================
# COVARIANCE MATRIX (SIMULATED)
# ==============================
cov_matrix = np.identity(n) * 0.02

# ==============================
# RISK-FREE RATE (DAILY)
# ==============================
risk_free_rate = 0.01 / 252

# ==============================
# PORTFOLIO PERFORMANCE
# ==============================
def portfolio_performance(weights):
    port_return = np.dot(weights, returns)
    port_vol = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
    return port_return, port_vol

# ==============================
# NEGATIVE SHARPE (MINIMIZE)
# ==============================
def negative_sharpe(weights):
    port_return, port_vol = portfolio_performance(weights)

    if port_vol == 0:
        return 0

    return -(port_return - risk_free_rate) / port_vol

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
# NORMALIZE (SAFETY)
# ==============================
weights = weights / np.sum(weights)

# ==============================
# RESULTS
# ==============================
portfolio = pd.DataFrame({
    "Stock": stocks,
    "Weight": np.round(weights, 2)
})

port_return, port_vol = portfolio_performance(weights)
sharpe = (port_return - risk_free_rate) / port_vol

print("\nOptimal Portfolio Allocation:")
print(portfolio)

print(f"\nExpected Return: {port_return:.4f}")
print(f"Volatility: {port_vol:.4f}")
print(f"Sharpe Ratio: {sharpe:.4f}")