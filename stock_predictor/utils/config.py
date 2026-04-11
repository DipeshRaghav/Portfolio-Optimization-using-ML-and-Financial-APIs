"""Central configuration: ensemble weights, risk params, backtest costs."""

from dataclasses import dataclass, field
from typing import Dict


@dataclass
class EnsembleWeights:
    """
    Weights for combining model outputs (must sum to 1.0 for interpretability).
    """

    chart: float = 0.30
    indicator: float = 0.20
    sentiment: float = 0.15
    historical: float = 0.20
    market: float = 0.15

    def as_dict(self) -> Dict[str, float]:
        return {
            "chart": self.chart,
            "indicator": self.indicator,
            "sentiment": self.sentiment,
            "historical": self.historical,
            "market": self.market,
        }

    def validate(self) -> None:
        total = sum(self.as_dict().values())
        if abs(total - 1.0) > 1e-6:
            raise ValueError(f"Ensemble weights must sum to 1.0, got {total}")


@dataclass
class ModelConfig:
    """Shared hyperparameters and paths."""

    sequence_length: int = 60
    random_seed: int = 42
    transaction_cost_bps: float = 10.0  # basis points per trade side
    var_confidence: float = 0.95
    risk_free_rate_annual: float = 0.02


@dataclass
class DecisionThresholds:
    """Map continuous score to buy / hold / sell."""

    buy_min: float = 0.58
    sell_max: float = 0.42
