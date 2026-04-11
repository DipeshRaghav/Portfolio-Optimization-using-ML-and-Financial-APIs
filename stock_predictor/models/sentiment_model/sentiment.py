"""
Sentiment vertical: transformer-based polarity on headlines.

Uses HuggingFace pipeline when transformers/torch are installed; otherwise
keyword-based mock sentiment for CI and lightweight environments.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable, Dict, List, Optional

import numpy as np


def _keyword_polarity_one(headline: str) -> float:
    pos = sum(
        1
        for w in ("beat", "strong", "upgrade", "growth", "positive", "gain", "bull")
        if w in headline.lower()
    )
    neg = sum(
        1
        for w in ("miss", "weak", "downgrade", "concern", "loss", "volatile", "bear")
        if w in headline.lower()
    )
    return float(np.tanh((pos - neg) / 2.0))


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
        full = self.score_headlines_detailed(headlines)
        return {k: full[k] for k in ("sentiment_score", "prob_up", "raw_score") if k in full}

    def score_headlines_detailed(self, headlines: List[str]) -> Dict[str, Any]:
        """
        Per-headline labels for UI + ensemble mapping.
        Runtime uses pretrained DistilBERT SST-2; financial fine-tune (FinBERT) is optional upgrade.
        """
        self._load_pipeline()
        items: List[Dict[str, Any]] = []
        scores: List[float] = []
        mode = "distilbert-sst2"
        if self._use_mock or self._pipe is None:
            mode = "keyword-fallback"
            for h in headlines:
                pol = _keyword_polarity_one(h)
                items.append(
                    {
                        "headline": h[:500],
                        "label": "POSITIVE" if pol > 0 else "NEGATIVE",
                        "polarity": pol,
                    }
                )
                scores.append(pol)
        else:
            # One batched transformer call for the first N headlines; keyword fallback for the rest.
            sent_cap = 15
            batch_out: List[Dict[str, Any]] = []
            if headlines:
                primary = headlines[:sent_cap]
                texts = [h[:512] for h in primary]
                raw = self._pipe(texts)
                if isinstance(raw, dict):
                    batch_out = [raw]
                else:
                    batch_out = list(raw)

            for i, h in enumerate(headlines):
                if i < sent_cap and i < len(batch_out):
                    out = batch_out[i]
                    label = out["label"].lower()
                    s = float(out["score"])
                    if "pos" in label:
                        pol = s
                    else:
                        pol = -s
                    pol = float(np.clip(pol, -1.0, 1.0))
                    scores.append(pol)
                    items.append(
                        {
                            "headline": h[:500],
                            "label": out["label"],
                            "polarity": pol,
                            "model_confidence": s,
                        }
                    )
                else:
                    pol = _keyword_polarity_one(h)
                    scores.append(pol)
                    items.append(
                        {
                            "headline": h[:500],
                            "label": "POSITIVE" if pol > 0 else "NEGATIVE",
                            "polarity": pol,
                            "model_mode": "keyword-extra",
                        }
                    )

        avg = float(np.mean(scores)) if scores else 0.0
        avg = float(np.clip(avg, -1.0, 1.0))
        prob_bullish = float(np.clip((avg + 1) / 2, 0.0, 1.0))

        return {
            "sentiment_score": avg,
            "prob_up": prob_bullish,
            "raw_score": prob_bullish,
            "headlines_scored": items,
            "model_mode": mode,
            "model_name": self.model_name,
            "training_note": (
                "Inference uses a general English sentiment model (DistilBERT SST-2). "
                "For production finance NLP, fine-tune FinBERT/yfinance-labeled headlines or use "
                "vendor sentiment scores; optional APIs: FINNHUB_API_KEY, NEWS_API_KEY enrich coverage."
            ),
        }
