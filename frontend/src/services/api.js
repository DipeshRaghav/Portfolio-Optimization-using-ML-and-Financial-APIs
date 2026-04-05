const BASE_URL = "http://127.0.0.1:8000"; // Temporarily pointing to local backend instead of Render

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