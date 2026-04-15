import { useState, useEffect } from "react";
import StockSelector from "../components/stock/StockSelector";
import StockChart from "../components/stock/StockChart";
import TechnicalIndicators from "../components/indicators/TechnicalIndicators";
import MLPredictions from "../components/predictions/MLPredictions";
import PortfolioAllocation from "../components/portfolio/PortfolioAllocation";
import RiskMetrics from "../components/risk/RiskMetrics";
import EfficientFrontier from "../components/frontier/EfficientFrontier";
import { getOptimizationData } from "../services/api";

export default function DashboardPage({ selectedStocks, setSelectedStocks }) {
  const [activeStock, setActiveStock] = useState(selectedStocks[0] || "");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);
  const [optimizationData, setOptimizationData] = useState(null);

  useEffect(() => {
    handleAnalyze(selectedStocks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalyze = async (stocks) => {
    if (!stocks.length) return;
    setIsLoading(true);
    
    const optData = await getOptimizationData(stocks);
    if (optData && !optData.error) {
      setOptimizationData(optData);
    }

    setIsLoading(false);
    setHasAnalyzed(true);
  };

  return (
    <div className="px-12 py-10 page-fade flex flex-col gap-8">

      {/* ═══ ROW 1: Stock Selection + Chart + Risk ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Stock Selection */}
        <div className="lg:col-span-3">
          <StockSelector
            selected={selectedStocks}
            setSelected={setSelectedStocks}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
        </div>

        {/* Center: Stock Tabs + Price Chart */}
        <div className="lg:col-span-6">
          {/* Stock Tabs */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {selectedStocks.map((s) => (
              <button
                key={s}
                onClick={() => setActiveStock(s)}
                className={`px-5 py-2 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 ${
                  activeStock === s
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-lg shadow-blue-500/10"
                    : "bg-slate-800/40 text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-700/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <StockChart selectedStocks={[activeStock]} activeStock={activeStock} />
        </div>

        {/* Right: Risk Analysis */}
        <div className="lg:col-span-3">
          <RiskMetrics data={optimizationData} />
        </div>
      </div>

      {/* ═══ ROW 2: ML Predictions ═══ */}
      <div className="w-full">
        {hasAnalyzed && <MLPredictions selectedStocks={selectedStocks} />}
      </div>

      {/* ═══ ROW 3: Technical Indicators ═══ */}
      <div className="w-full">
        <TechnicalIndicators selectedStocks={[activeStock]} />
      </div>

      {/* ═══ ROW 4: Portfolio + Frontier ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioAllocation data={optimizationData} selectedStocks={selectedStocks} />
        <EfficientFrontier data={optimizationData} />
      </div>

    </div>
  );
}
