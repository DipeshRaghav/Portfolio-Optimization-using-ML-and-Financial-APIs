// ─── Mock Stock Price History ───────────────────────────────────────────────
const generatePriceData = (base, days, volatility = 5) => {
  const data = [];
  let price = base;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    price += (Math.random() - 0.48) * volatility;
    price = Math.max(price, base * 0.6);
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      price: parseFloat(price.toFixed(2)),
      ma20: parseFloat((price * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2)),
      ma50: parseFloat((price * (1 + (Math.random() - 0.5) * 0.03)).toFixed(2)),
      volume: Math.floor(Math.random() * 80000000 + 20000000),
    });
  }
  return data;
};

export const stockHistories = {
  AAPL: generatePriceData(178, 365, 4),
  MSFT: generatePriceData(380, 365, 6),
  GOOGL: generatePriceData(155, 365, 5),
  TSLA: generatePriceData(240, 365, 14),
  AMZN: generatePriceData(185, 365, 7),
  NVDA: generatePriceData(870, 365, 20),
};

// ─── Technical Indicators ────────────────────────────────────────────────────
export const technicalIndicators = {
  AAPL: { rsi: 62, rsiLabel: "Neutral", ma20: "Bullish", ma50: "Bullish", macd: "Positive", volume: "Above Avg", macdValue: 1.24, bbUpper: 182.5, bbLower: 173.2 },
  MSFT: { rsi: 71, rsiLabel: "Overbought", ma20: "Bullish", ma50: "Bullish", macd: "Positive", volume: "High", macdValue: 2.87, bbUpper: 392, bbLower: 368 },
  GOOGL: { rsi: 48, rsiLabel: "Neutral", ma20: "Bearish", ma50: "Neutral", macd: "Negative", volume: "Below Avg", macdValue: -0.54, bbUpper: 158.4, bbLower: 151.6 },
  TSLA: { rsi: 38, rsiLabel: "Oversold", ma20: "Bearish", ma50: "Bearish", macd: "Negative", volume: "High", macdValue: -3.21, bbUpper: 252, bbLower: 228 },
  AMZN: { rsi: 55, rsiLabel: "Neutral", ma20: "Bullish", ma50: "Neutral", macd: "Positive", volume: "Avg", macdValue: 0.98, bbUpper: 189, bbLower: 181 },
  NVDA: { rsi: 67, rsiLabel: "Neutral", ma20: "Bullish", ma50: "Bullish", macd: "Positive", volume: "Very High", macdValue: 5.43, bbUpper: 905, bbLower: 835 },
};

// ─── ML Predictions ──────────────────────────────────────────────────────────
export const mlPredictions = [
  { stock: "AAPL", currentPrice: 178.42, predictedReturn: 1.24, signal: "Buy", confidence: 82, targetPrice: 180.63 },
  { stock: "MSFT", currentPrice: 382.15, predictedReturn: 0.87, signal: "Buy", confidence: 76, targetPrice: 385.48 },
  { stock: "GOOGL", currentPrice: 155.72, predictedReturn: -0.43, signal: "Hold", confidence: 61, targetPrice: 155.05 },
  { stock: "TSLA", currentPrice: 241.88, predictedReturn: -1.82, signal: "Sell", confidence: 71, targetPrice: 237.48 },
  { stock: "AMZN", currentPrice: 186.34, predictedReturn: 1.56, signal: "Buy", confidence: 79, targetPrice: 189.25 },
  { stock: "NVDA", currentPrice: 878.5, predictedReturn: 2.31, signal: "Buy", confidence: 88, targetPrice: 898.81 },
];

// ─── Portfolio Allocation ────────────────────────────────────────────────────
export const defaultAllocation = [
  { name: "AAPL", value: 30, color: "#3b82f6" },
  { name: "MSFT", value: 25, color: "#8b5cf6" },
  { name: "GOOGL", value: 20, color: "#22c55e" },
  { name: "TSLA", value: 25, color: "#f59e0b" },
];

export const optimizedAllocation = [
  { name: "AAPL", value: 35, color: "#3b82f6" },
  { name: "MSFT", value: 28, color: "#8b5cf6" },
  { name: "NVDA", value: 22, color: "#22c55e" },
  { name: "AMZN", value: 10, color: "#f59e0b" },
  { name: "GOOGL", value: 5, color: "#ec4899" },
];

// ─── Risk Metrics ────────────────────────────────────────────────────────────
export const riskMetrics = {
  expectedReturn: 14.7,
  volatility: 8.3,
  sharpeRatio: 1.77,
  sortinoRatio: 2.14,
  maxDrawdown: -12.4,
  beta: 1.12,
  alpha: 3.2,
  varDaily: -1.84,
};

// ─── Efficient Frontier ──────────────────────────────────────────────────────
export const efficientFrontierData = Array.from({ length: 60 }, (_, i) => ({
  risk: parseFloat((4 + i * 0.6).toFixed(2)),
  return: parseFloat((3 + Math.sqrt(i) * 2.8 + Math.random() * 0.5).toFixed(2)),
})).sort((a, b) => a.risk - b.risk);

export const randomPortfolios = Array.from({ length: 120 }, () => ({
  risk: parseFloat((5 + Math.random() * 22).toFixed(2)),
  return: parseFloat((2 + Math.random() * 16).toFixed(2)),
}));

export const optimalPoint = { risk: 10.4, return: 14.7 };

// ─── Market Ticker Data ──────────────────────────────────────────────────────
export const tickerData = [
  { symbol: "AAPL", price: 178.42, change: 1.24, pct: 0.7 },
  { symbol: "MSFT", price: 382.15, change: -2.34, pct: -0.61 },
  { symbol: "GOOGL", price: 155.72, change: 0.86, pct: 0.56 },
  { symbol: "TSLA", price: 241.88, change: -6.42, pct: -2.58 },
  { symbol: "AMZN", price: 186.34, change: 3.12, pct: 1.7 },
  { symbol: "NVDA", price: 878.5, change: 18.4, pct: 2.14 },
  { symbol: "META", price: 512.7, change: 5.28, pct: 1.04 },
  { symbol: "BRK.B", price: 413.6, change: -1.1, pct: -0.27 },
  { symbol: "JPM", price: 199.3, change: 2.45, pct: 1.24 },
  { symbol: "V", price: 278.9, change: -0.88, pct: -0.31 },
  { symbol: "BTC", price: 68420, change: 1240, pct: 1.84 },
  { symbol: "ETH", price: 3812, change: -88, pct: -2.26 },
];

// ─── Simulation Data Generator ───────────────────────────────────────────────
export const generateSimulation = (initialInvestment, years, annualReturn, volatility) => {
  const data = [];
  let value = initialInvestment;
  const monthlyReturn = annualReturn / 12 / 100;
  const monthlyVol = volatility / Math.sqrt(12) / 100;
  for (let m = 0; m <= years * 12; m++) {
    const shock = (Math.random() - 0.5) * monthlyVol * 2;
    value *= 1 + monthlyReturn + shock;
    if (m % 3 === 0) {
      data.push({
        month: m,
        label: m === 0 ? "Start" : `Q${Math.ceil(m / 3)}`,
        value: parseFloat(value.toFixed(2)),
        baseline: parseFloat((initialInvestment * Math.pow(1 + annualReturn / 100, m / 12)).toFixed(2)),
      });
    }
  }
  return data;
};

// ─── Market Analysis Sector Data ─────────────────────────────────────────────
export const sectorPerformance = [
  { sector: "Technology", change: 2.14, ytd: 18.4 },
  { sector: "Healthcare", change: 0.82, ytd: 7.2 },
  { sector: "Financials", change: 1.24, ytd: 12.8 },
  { sector: "Energy", change: -0.54, ytd: -3.1 },
  { sector: "Consumer", change: 0.38, ytd: 5.6 },
  { sector: "Materials", change: -1.12, ytd: -8.4 },
  { sector: "Utilities", change: -0.28, ytd: -2.7 },
  { sector: "Real Estate", change: 0.64, ytd: 4.3 },
];
