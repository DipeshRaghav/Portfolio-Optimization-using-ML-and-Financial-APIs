import pandas as pd
import numpy as np
import os
from scipy.optimize import minimize

DATA_PATH = "data/processed"
PREDICTION_PATH = "results/predicted_returns.csv"


# -----------------------------
# 1. Load Returns Data
# -----------------------------
def load_returns():

    all_data = []

    for file in os.listdir(DATA_PATH):
        if file.endswith(".csv"):
            df = pd.read_csv(os.path.join(DATA_PATH, file))

            stock = file.split("_")[0]

            # 🔥 IMPORTANT: select only return column
            if "Return" in df.columns:
                df = df[["Return"]]
            else:
                # fallback (if column name different)
                df = df.iloc[:, 0]
                df = df.to_frame(name="Return")

            df["Stock"] = stock
            all_data.append(df)

    combined = pd.concat(all_data, axis=0)

    pivot = combined.pivot(columns="Stock", values="Return")

    return pivot.dropna()


# -----------------------------
# 2. Load Predicted Returns
# -----------------------------
def load_predictions():
    df = pd.read_csv(PREDICTION_PATH)
    return df.set_index("Stock")["Predicted_Return"]


# -----------------------------
# 3. Portfolio Performance
# -----------------------------
def portfolio_performance(weights, returns, cov_matrix):

    portfolio_return = np.dot(weights, returns)
    portfolio_volatility = np.sqrt(
        np.dot(weights.T, np.dot(cov_matrix, weights))
    )

    return portfolio_return, portfolio_volatility


# -----------------------------
# 4. Objective Function
# -----------------------------
def negative_sharpe(weights, returns, cov_matrix, risk_free_rate=0.01):

    p_return, p_vol = portfolio_performance(weights, returns, cov_matrix)

    sharpe = (p_return - risk_free_rate) / p_vol

    return -sharpe


# -----------------------------
# 5. Optimize Portfolio
# -----------------------------
def optimize_portfolio(returns_df, predicted_returns):

    cov_matrix = returns_df.cov()

    num_assets = len(predicted_returns)

    args = (predicted_returns.values, cov_matrix)

    constraints = ({
        'type': 'eq',
        'fun': lambda x: np.sum(x) - 1
    })

    bounds = tuple((0.05, 0.6) for _ in range(num_assets))

    init_guess = num_assets * [1. / num_assets]

    result = minimize(
        negative_sharpe,
        init_guess,
        args=args,
        method='SLSQP',
        bounds=bounds,
        constraints=constraints
    )

    return result.x


# -----------------------------
# 6. Save Results
# -----------------------------
def save_weights(weights, stocks):

    os.makedirs("results", exist_ok=True)

    df = pd.DataFrame({
        "Stock": stocks,
        "Weight": weights
    })

    df.to_csv("results/portfolio_weights.csv", index=False)

    print("\nOptimal Portfolio Allocation:")
    print(df)


# -----------------------------
# 7. Run
# -----------------------------
if __name__ == "__main__":

    print("Loading returns data...")
    returns_df = load_returns()

    print("Loading predicted returns...")
    predicted_returns = load_predictions()

    print("Optimizing portfolio...")
    weights = optimize_portfolio(returns_df, predicted_returns)

    save_weights(weights, predicted_returns.index)

    # 🔥 EXTRA (for viva)
    ret, vol = portfolio_performance(weights, predicted_returns.values, returns_df.cov())

    print(f"\nExpected Return: {ret:.4f}")
    print(f"Volatility: {vol:.4f}")
    print(f"Sharpe Ratio: {(ret-0.01)/vol:.4f}")