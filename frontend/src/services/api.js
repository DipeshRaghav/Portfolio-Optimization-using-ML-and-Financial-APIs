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