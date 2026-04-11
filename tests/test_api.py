"""Smoke tests for the FastAPI app (no live yfinance calls)."""

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_root():
    r = client.get("/")
    assert r.status_code == 200
    body = r.json()
    assert "message" in body


def test_search_requires_query():
    r = client.get("/search")
    assert r.status_code == 422
