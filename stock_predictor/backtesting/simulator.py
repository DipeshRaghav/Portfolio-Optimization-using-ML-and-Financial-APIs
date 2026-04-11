"""
Simple long-only backtest with transaction costs and performance stats.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict

import numpy as np
import pandas as pd

from stock_predictor.utils.config import ModelConfig


@dataclass
class BacktestConfig:
    initial_cash: float = 100_000.0
    position_size: float = 1.0  # fraction of equity allocated when signal is buy
    cost_bps: float = ModelConfig().transaction_cost_bps


@dataclass
class BacktestResult:
    total_return: float
    sharpe: float
    win_rate: float
    max_drawdown: float
    equity_curve: pd.Series


def run_backtest(
    price: pd.Series,
    signal: pd.Series,
    config: BacktestConfig | None = None,
) -> BacktestResult:
    """
    price: daily close
    signal: 1 buy/hold long, 0 flat (simplified from buy/hold/sell strings mapped externally)
    """
    cfg = config or BacktestConfig()
    price = price.astype(float).copy()
    signal = signal.reindex(price.index).fillna(0)

    ret = price.pct_change().fillna(0.0)
    position = signal.shift(1).fillna(0)  # next-day execution

    port_ret = position * ret
    # Transaction cost when position changes
    pos_chg = position.diff().abs().fillna(0)
    cost = pos_chg * (cfg.cost_bps / 10000.0)
    port_ret = port_ret - cost

    equity = cfg.initial_cash * (1 + port_ret).cumprod()
    total_return = float(equity.iloc[-1] / equity.iloc[0] - 1)

    dr = port_ret
    sharpe = float(np.sqrt(252) * dr.mean() / (dr.std() + 1e-12))

    wins = (dr > 0).sum()
    win_rate = float(wins / max(len(dr) - 1, 1))

    peak = equity.cummax()
    max_dd = float(abs(((equity / peak) - 1).min()))

    return BacktestResult(
        total_return=total_return,
        sharpe=sharpe,
        win_rate=win_rate,
        max_drawdown=max_dd,
        equity_curve=equity,
    )
