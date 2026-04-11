"""
Weighted ensemble of five model scores → final signal and confidence.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Literal

from stock_predictor.utils.config import DecisionThresholds, EnsembleWeights
from stock_predictor.utils.helpers import clip_prob


Signal = Literal["buy", "sell", "hold"]


@dataclass
class EnsembleResult:
    final_score: float
    confidence: float
    signal: Signal
    breakdown: Dict[str, float]


class EnsembleCombiner:
    def __init__(
        self,
        weights: EnsembleWeights | None = None,
        thresholds: DecisionThresholds | None = None,
    ):
        self.weights = weights or EnsembleWeights()
        self.weights.validate()
        self.thresholds = thresholds or DecisionThresholds()

    def combine(
        self,
        chart: float,
        indicator: float,
        sentiment: float,
        historical: float,
        market: float,
    ) -> EnsembleResult:
        """
        Each input is a 0–1 bullish probability-style score (except sentiment
        already mapped to prob in the sentiment module).
        """
        w = self.weights.as_dict()
        final = (
            w["chart"] * chart
            + w["indicator"] * indicator
            + w["sentiment"] * sentiment
            + w["historical"] * historical
            + w["market"] * market
        )
        final = clip_prob(final)
        # Confidence: how far from 0.5 the ensemble is, scaled to [0,1]
        confidence = float(abs(final - 0.5) * 2.0)

        if final >= self.thresholds.buy_min:
            sig: Signal = "buy"
        elif final <= self.thresholds.sell_max:
            sig = "sell"
        else:
            sig = "hold"

        breakdown = {
            "chart": chart,
            "indicator": indicator,
            "sentiment": sentiment,
            "historical": historical,
            "market": market,
        }
        return EnsembleResult(
            final_score=final,
            confidence=confidence,
            signal=sig,
            breakdown=breakdown,
        )
