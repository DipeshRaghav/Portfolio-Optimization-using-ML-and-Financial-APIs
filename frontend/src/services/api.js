const BASE_URL = import.meta.env.VITE_API_URL || "https://portfolio-ml-api.onrender.com";

// GET ML PREDICTIONS
export const getPredictions = async (stocks) => {
  try {
    let url = `${BASE_URL}/predict`;

    if (stocks && stocks.length > 0) {
      url += `?stocks=${stocks.join(",")}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.error("Prediction API Error:", data.error);
      return { predictions: [], feature_importances: {} };
    }

    return data; // returns { predictions: [], feature_importances: {} }
  } catch (error) {
    console.error("Prediction Fetch Error:", error);
    return { predictions: [], feature_importances: {} };
  }
};


// GET MARKET DATA (FIXED + SAFE)
export const getMarketData = async (stocks, period = "1mo") => {
  try {
    if (!stocks || stocks.length === 0) return {};

    const url = `${BASE_URL}/market-data?stocks=${stocks.join(",")}&period=${period}`;
    console.log("FETCH URL:", url);

    const res = await fetch(url);
    const data = await res.json();

    // HANDLE BACKEND ERROR
    if (data.error) {
      console.error("Market API Error:", data.error);
      return {};
    }

    console.log("MARKET DATA:", data);
    return data;

  } catch (error) {
    console.error("Market Fetch Error:", error);
    return {};
  }
};

// GET OPTIMIZATION DATA
export const getOptimizationData = async (stocks) => {
  try {
    if (!stocks || stocks.length === 0) return null;

    const url = `${BASE_URL}/optimize?stocks=${stocks.join(",")}`;
    console.log("FETCH OPTIMIZE URL:", url);

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.error("Optimize API Error:", data.error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Optimize Fetch Error:", error);
    return null;
  }
};

// SEARCH STOCKS
export const searchStocks = async (query) => {
  try {
    if (!query) return [];
    const url = `${BASE_URL}/search?query=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) return [];
    return data.results || [];
  } catch (e) {
    return [];
  }
};

// GET TECHNICAL DATA
export const getTechnicalData = async (stock) => {
  try {
    if (!stock) return null;
    const url = `${BASE_URL}/technicals?stock=${encodeURIComponent(stock)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) return null;
    return data;
  } catch (e) {
    return null;
  }
};

/**
 * Multi-vertical stock_predictor pipeline: 5 models + ensemble + risk + backtest.
 * @param {string[]} stocks - Up to 5 tickers
 * @param {string} period - 6mo | 1y | 2y | 5y | ytd | max
 * @param {number} chartEpochs - LSTM epochs (2–12, lower = faster)
 */
export const getMultiModelPrediction = async (stocks, period = "2y", chartEpochs = 4) => {
  try {
    if (!stocks?.length) {
      return { results: [], errors: [{ symbol: "", error: "No symbols" }] };
    }
    const sym = stocks.map((s) => String(s).trim().toUpperCase()).filter(Boolean);
    const params = new URLSearchParams();
    params.set("period", period);
    params.set("chart_epochs", String(chartEpochs));
    params.set("stocks", sym.join(","));
    const url = `${BASE_URL}/multi-model/predict?${params.toString()}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      let msg = res.statusText || "Request failed";
      const d = data?.detail;
      if (typeof d === "string") msg = d;
      else if (Array.isArray(d)) msg = d.map((x) => x.msg || x).join("; ");
      return {
        results: [],
        errors: [{ symbol: "", error: msg }],
      };
    }
    return data;
  } catch (e) {
    console.error("Multi-model API Error:", e);
    return { results: [], errors: [{ symbol: "", error: String(e.message || e) }] };
  }
};

/**
 * Full Multi-AI report: reasons, news, price+forecast, macro series (single symbol).
 */
export const getMultiModelFullReport = async (symbol, period = "2y", chartEpochs = 4) => {
  try {
    const sym = String(symbol || "").trim().toUpperCase();
    if (!sym) return { error: "Symbol required" };
    const params = new URLSearchParams({
      symbol: sym,
      period,
      chart_epochs: String(chartEpochs),
    });
    const url = `${BASE_URL}/multi-model/full-report?${params.toString()}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      let msg = res.statusText;
      const d = data?.detail;
      if (typeof d === "string") msg = d;
      else if (Array.isArray(d)) msg = d.map((x) => x.msg || x).join("; ");
      return { error: msg };
    }
    return data;
  } catch (e) {
    console.error("full-report:", e);
    return { error: String(e?.message || e) };
  }
};
