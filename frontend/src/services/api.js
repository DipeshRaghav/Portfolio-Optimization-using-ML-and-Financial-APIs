const BASE_URL = "https://portfolio-ml-api.onrender.com";

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
      return [];
    }

    return data.predictions || [];
  } catch (error) {
    console.error("Prediction Fetch Error:", error);
    return [];
  }
};


// GET MARKET DATA (FIXED + SAFE)
export const getMarketData = async (stocks) => {
  try {
    if (!stocks || stocks.length === 0) return {};

    const url = `${BASE_URL}/market-data?stocks=${stocks.join(",")}`;
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