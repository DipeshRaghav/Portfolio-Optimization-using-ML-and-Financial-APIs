"""
Portfolio risk engine: volatility, historical VaR, max drawdown, heuristic suggestions.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List

import numpy as np
import pandas as pd

from stock_predictor.utils.config import ModelConfig


@dataclass
class RiskReport:
    portfolio_vol_annual: float
    var_historical: float
    max_drawdown: float
    risk_score: float
    suggestions: List[str]
    details: Dict[str, float] = field(default_factory=dict)


class PortfolioRiskEngine:
    def __init__(self, confidence: float | None = None):
        self.confidence = confidence or ModelConfig().var_confidence

    def evaluate(
        self,
        returns: pd.Series,
        weights: Dict[str, float],
        signal_strength: float,
    ) -> RiskReport:
        """
        returns: daily portfolio returns (same currency as prices).
        weights: symbol -> portfolio weight (sums to ~1).
        signal_strength: ensemble final_score in [0,1].
        """
        r = returns.dropna()
        vol_daily = float(r.std())
        vol_ann = float(vol_daily * np.sqrt(252))

        # Historical VaR: lower percentile of returns
        q = (1 - self.confidence) * 100
        var_h = float(np.percentile(r, q))

        cum = (1 + r).cumprod()
        peak = cum.cummax()
        dd = (cum / peak - 1.0).min()
        max_dd = float(abs(dd))

        # Simple risk score 0–100: higher = riskier
        risk_score = float(
            np.clip(40 * vol_ann + 30 * max_dd + 30 * min(abs(var_h) * 25, 1.0), 0, 100)
        )

        suggestions: List[str] = []
        if vol_ann > 0.25:
            suggestions.append("Annualized volatility is elevated; consider reducing position sizes.")
        if max_dd > 0.2:
            suggestions.append("Drawdowns have been deep; add diversification or hedges.")
        if var_h < -0.02:
            suggestions.append("Tail losses (VaR) are material; trim high-beta names.")
        if signal_strength > 0.65 and vol_ann < 0.2:
            suggestions.append("Signal strong vs moderate vol; mild overweight in line with policy.")
        if signal_strength < 0.4:
            suggestions.append("Weak ensemble signal; avoid new risk until outlook improves.")

        return RiskReport(
            portfolio_vol_annual=vol_ann,
            var_historical=var_h,
            max_drawdown=max_dd,
            risk_score=risk_score,
            suggestions=suggestions,
            details={"n_days": float(len(r)), "n_positions": float(len(weights))},
        )
