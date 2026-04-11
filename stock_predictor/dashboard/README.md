# Dashboard (optional)

This folder is reserved for a future UI (e.g. **Streamlit** or **Plotly Dash**) that calls
`stock_predictor.run_pipeline.run_prediction_pipeline` or the FastAPI service in `api/main.py`.

Minimal Streamlit sketch:

```python
# pip install streamlit
import streamlit as st
import pandas as pd
from stock_predictor.data.pipeline import build_data_bundle
from stock_predictor.run_pipeline import run_prediction_pipeline

st.title("Multi-model stock predictor")
bundle = build_data_bundle()
out = run_prediction_pipeline(bundle)
st.json(out)
```

Run: `streamlit run dashboard/app.py` (after creating `app.py`).
