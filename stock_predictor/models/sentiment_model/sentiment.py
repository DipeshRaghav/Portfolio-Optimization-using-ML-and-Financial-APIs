"""
Sentiment vertical: transformer-based polarity on headlines.

Uses HuggingFace pipeline when transformers/torch are installed; otherwise
keyword-based mock sentiment for CI and lightweight environments.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Dict, List, Optional

import numpy as np


def _mock_sentiment(headlines: List[str]) -> float:
    """Very rough polarity proxy for demos without heavy models."""
    pos = sum(
        1
        for h in headlines
        for w in ("beat", "strong", "upgrade", "growth", "positive", "gain")
        if w in h.lower()
    )
    neg = sum(
        1
        for h in headlines
        for w in ("miss", "weak", "downgrade", "concern", "loss", "volatile")
        if w in h.lower()
    )
    score = (pos - neg) / max(len(headlines), 1)
    return float(np.clip(score, -1.0, 1.0))


@dataclass
class SentimentTransformerModel:
    model_name: str = "distilbert-base-uncased-finetuned-sst-2-english"
    _pipe: Optional[Callable] = None
    _use_mock: bool = False

    def _load_pipeline(self) -> None:
        if self._pipe is not None or self._use_mock:
            return
        try:
            from transformers import pipeline  # noqa: WPS433

            self._pipe = pipeline(
                "sentiment-analysis",
                model=self.model_name,
                truncation=True,
            )
        except Exception:
            self._use_mock = True

    def score_headlines(self, headlines: List[str]) -> Dict[str, float]:
        """
        Returns average sentiment in [-1, 1] and a 0–1 'bullish probability' mapping.
        """
        self._load_pipeline()
        if self._use_mock or self._pipe is None:
            avg = _mock_sentiment(headlines)
        else:
            scores = []
            for h in headlines:
                out = self._pipe(h[:512])[0]
                label = out["label"].lower()
                s = out["score"]
                # Map POSITIVE/NEGATIVE to directional sign
                if "pos" in label:
                    pol = s
                else:
                    pol = -s
                scores.append(pol)
            avg = float(np.mean(scores)) if scores else 0.0
            avg = float(np.clip(avg, -1.0, 1.0))

        # Map [-1,1] → [0,1] for ensemble compatibility (0.5 = neutral)
        prob_bullish = float(np.clip((avg + 1) / 2, 0.0, 1.0))
        return {
            "sentiment_score": avg,
            "prob_up": prob_bullish,
            "raw_score": prob_bullish,
        }
