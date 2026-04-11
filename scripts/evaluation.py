import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')  # avoid GUI issues
import matplotlib.pyplot as plt
import os

WEIGHTS_PATH = "results/portfolio_weights.csv"
DATA_PATH = "data/processed"


# -----------------------------
# 1. Load Portfolio Weights
# -----------------------------
def load_weights():
    df = pd.read_csv(WEIGHTS_PATH)
    return df.set_index("Stock")["Weight"]


# -----------------------------
# 2. Load Returns Data
# -----------------------------
def load_returns():
    all_data = []

    for file in os.listdir(DATA_PATH):
        if file.endswith(".csv"):
            df = pd.read_csv(os.path.join(DATA_PATH, file))

            stock = file.split("_")[0]

            df = df[["Return"]]  # ✅ fixed column issue
            df["Stock"] = stock

            all_data.append(df)

    combined = pd.concat(all_data, axis=0)

    pivot = combined.pivot(columns="Stock", values="Return")

    return pivot.dropna()


# -----------------------------
# 3. Portfolio Performance
# -----------------------------
def calculate_performance(weights, returns_df):

    portfolio_returns = returns_df.dot(weights)

    expected_return = portfolio_returns.mean()
    volatility = portfolio_returns.std()

    risk_free_daily = 0.02 / 252
    sharpe_ratio = (
        (expected_return - risk_free_daily) / volatility if volatility != 0 else 0
    )

    # ✅ Sortino Ratio (downside risk only)
    downside_returns = portfolio_returns[portfolio_returns < 0]
    downside_std = downside_returns.std()

    sortino_ratio = expected_return / downside_std if downside_std != 0 else 0

    return portfolio_returns, expected_return, volatility, sharpe_ratio, sortino_ratio


# -----------------------------
# 4. Plot Portfolio Allocation
# -----------------------------
def plot_weights(weights):

    os.makedirs("results", exist_ok=True)

    plt.figure(figsize=(6, 6))
    plt.pie(weights, labels=weights.index, autopct='%1.1f%%')
    plt.title("Portfolio Allocation")

    plt.savefig("results/portfolio_pie.png")
    print("Saved: results/portfolio_pie.png")


# -----------------------------
# 5. Plot Portfolio Performance
# -----------------------------
def plot_performance(portfolio_returns):

    cumulative_returns = (1 + portfolio_returns).cumprod()

    plt.figure(figsize=(10, 5))
    plt.plot(cumulative_returns)
    plt.title("Portfolio Growth Over Time")
    plt.xlabel("Time")
    plt.ylabel("Growth")
    plt.grid()

    plt.savefig("results/portfolio_growth.png")
    print("Saved: results/portfolio_growth.png")


# -----------------------------
# 6. Save Metrics
# -----------------------------
def save_metrics(expected_return, volatility, sharpe, sortino):

    os.makedirs("results/metrics", exist_ok=True)

    df = pd.DataFrame({
        "Expected Return": [expected_return],
        "Volatility": [volatility],
        "Sharpe Ratio": [sharpe],
        "Sortino Ratio": [sortino]   # ✅ added
    })

    df.to_csv("results/metrics/performance_metrics.csv", index=False)

    print("Saved: results/metrics/performance_metrics.csv")


# -----------------------------
# 7. Run Evaluation
# -----------------------------
if __name__ == "__main__":

    print("Loading portfolio weights...")
    weights = load_weights()

    print("Loading returns data...")
    returns_df = load_returns()

    print("Calculating performance...")
    portfolio_returns, exp_return, vol, sharpe, sortino = calculate_performance(weights, returns_df)

    print("\n📊 Performance Metrics")
    print("------------------------")
    print(f"Expected Return: {exp_return:.4f}")
    print(f"Volatility: {vol:.4f}")
    print(f"Sharpe Ratio: {sharpe:.4f}")
    print(f"Sortino Ratio: {sortino:.4f}")  # ✅ added

    print("\nGenerating plots...")
    plot_weights(weights)
    plot_performance(portfolio_returns)

    save_metrics(exp_return, vol, sharpe, sortino)