"""
Real-world news for sentiment: Yahoo Finance (primary), optional Finnhub & NewsAPI.

Set env: FINNHUB_API_KEY, NEWS_API_KEY for additional / backup coverage.
"""

from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Tuple

import requests


def _yf_news(symbol: str, max_items: int = 25) -> List[Dict[str, Any]]:
    """Yahoo Finance ticker news (no API key)."""
    try:
        import yfinance as yf

        t = yf.Ticker(symbol)
        raw = getattr(t, "news", None) or []
        out: List[Dict[str, Any]] = []
        for item in raw[:max_items]:
            title = (item.get("title") or "").strip()
            if not title:
                continue
            ts = item.get("providerPublishTime") or item.get("pubDate")
            if isinstance(ts, (int, float)):
                dt = datetime.fromtimestamp(ts, tz=timezone.utc)
            else:
                dt = datetime.now(timezone.utc)
            out.append(
                {
                    "title": title,
                    "publisher": item.get("publisher", ""),
                    "link": item.get("link", ""),
                    "published": dt.isoformat(),
                }
            )
        return out
    except Exception:
        return []


def _finnhub_news(symbol: str, days_back: int = 120, max_items: int = 25) -> List[Dict[str, Any]]:
    key = os.environ.get("FINNHUB_API_KEY") or os.environ.get("FINNHUB_TOKEN")
    if not key:
        return []
    try:
        end = datetime.utcnow().date()
        start = end - timedelta(days=days_back)
        url = (
            "https://finnhub.io/api/v1/company-news"
            f"?symbol={symbol}&from={start}&to={end}&token={key}"
        )
        r = requests.get(url, timeout=12)
        r.raise_for_status()
        data = r.json() or []
        out: List[Dict[str, Any]] = []
        for item in data[:max_items]:
            title = (item.get("headline") or "").strip()
            if not title:
                continue
            ts = item.get("datetime")
            if ts:
                dt = datetime.fromtimestamp(int(ts), tz=timezone.utc)
            else:
                dt = datetime.now(timezone.utc)
            out.append(
                {
                    "title": title,
                    "publisher": item.get("source", "finnhub"),
                    "link": item.get("url", ""),
                    "published": dt.isoformat(),
                }
            )
        return out
    except Exception:
        return []


def _newsapi_everything(query: str, max_items: int = 15) -> List[Dict[str, Any]]:
    key = os.environ.get("NEWS_API_KEY")
    if not key:
        return []
    try:
        from_date = (datetime.utcnow() - timedelta(days=30)).strftime("%Y-%m-%d")
        url = (
            "https://newsapi.org/v2/everything"
            f"?q={requests.utils.quote(query)}&from={from_date}"
            "&sortBy=publishedAt&language=en&pageSize=30"
            f"&apiKey={key}"
        )
        r = requests.get(url, timeout=12)
        r.raise_for_status()
        articles = (r.json() or {}).get("articles") or []
        out: List[Dict[str, Any]] = []
        for a in articles[:max_items]:
            title = (a.get("title") or "").strip()
            if not title:
                continue
            pub = a.get("publishedAt") or ""
            out.append(
                {
                    "title": title,
                    "publisher": (a.get("source") or {}).get("name", "newsapi"),
                    "link": a.get("url", ""),
                    "published": pub,
                }
            )
        return out
    except Exception:
        return []


def fetch_company_news(symbol: str, max_headlines: int = 20) -> Tuple[List[str], List[Dict[str, Any]]]:
    """
    Returns (headlines_for_model, rich_articles_for_ui).

    De-duplicates titles; prefers Yahoo, then Finnhub, then NewsAPI (company name query).
    """
    seen = set()
    merged: List[Dict[str, Any]] = []

    for chunk in (_yf_news(symbol), _finnhub_news(symbol)):
        for a in chunk:
            t = a["title"].lower()
            if t in seen:
                continue
            seen.add(t)
            merged.append(a)
        if len(merged) >= max_headlines:
            break

    if len(merged) < 5:
        for a in _newsapi_everything(symbol, max_items=15):
            t = a["title"].lower()
            if t in seen:
                continue
            seen.add(t)
            merged.append(a)

    # de-dupe again
    final: List[Dict[str, Any]] = []
    seen.clear()
    for a in merged:
        k = a["title"].lower()
        if k in seen:
            continue
        seen.add(k)
        final.append(a)
        if len(final) >= max_headlines:
            break

    headlines = [a["title"] for a in final]
    if not headlines:
        headlines = [f"{symbol} — no recent headlines returned; using neutral placeholder."]
        final = [
            {
                "title": headlines[0],
                "publisher": "system",
                "link": "",
                "published": datetime.now(timezone.utc).isoformat(),
            }
        ]

    return headlines[:max_headlines], final[:max_headlines]
