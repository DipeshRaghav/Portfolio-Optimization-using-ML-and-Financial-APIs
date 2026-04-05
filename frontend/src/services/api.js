const BASE_URL = "https://portfolio-ml-api.onrender.com";

export const getPredictions = async () => {
  try {
    const response = await fetch(`${BASE_URL}/predict`);
    const data = await response.json();
    return data.predictions;
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return [];
  }
};
export const getMarketData = async (stocks) => {
  try {
    const query = stocks.join(",");
    const res = await fetch(`${BASE_URL}/market-data?stocks=${query}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching market data:", error);
    return {};
  }
};