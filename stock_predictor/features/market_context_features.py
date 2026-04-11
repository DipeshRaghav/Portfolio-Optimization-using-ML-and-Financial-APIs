"""Normalize market context inputs into a fixed-length feature vector."""

from __future__ import annotations

import numpy as np
import pandas as pd


def market_features_vector(row: pd.Series) -> np.ndarray:
    """
    row keys: index_return_20d, vix_level, sector_strength, breadth
    """
    r = row["index_return_20d"]
    vix = row["vix_level"]
    sec = row["sector_strength"]
    br = row["breadth"]
    # crude normalization for demo; learn scalers from training data in production
    return np.array(
        [
            np.tanh(r * 10),
            (vix - 20) / 20,
            sec,
            (br - 0.5) * 2,
        ],
        dtype=np.float64,
    )
