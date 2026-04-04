import { useState } from "react";
import StockSelector from "../components/stock/StockSelector";
import StockChart from "../components/stock/StockChart";
import TechnicalIndicators from "../components/indicators/TechnicalIndicators";
import MLPredictions from "../components/predictions/MLPredictions";
import PortfolioAllocation from "../components/portfolio/PortfolioAllocation";
import RiskMetrics from "../components/risk/RiskMetrics";
import EfficientFrontier from "../components/frontier/EfficientFrontier";
import InvestmentSimulation from "../components/simulation/InvestmentSimulation";

export default function DashboardPage() {
  const [selectedStocks, setSelectedStocks] = useState(["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN"]);
  const [activeStock, setActiveStock] = useState("AMZN");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);

  const handleAnalyze = (stocks) => {
    if (!stocks.length) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasAnalyzed(true);
    }, 1500);
  };

  return (
    <div className="p-6 lg:p-8 page-fade">

      {/* ═══ ROW 1: Stock Selection + Chart + Risk ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

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
          <RiskMetrics />
        </div>
      </div>

      {/* ═══ ROW 2: Technical Indicators + ML Predictions ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-3">
          <TechnicalIndicators selectedStocks={[activeStock]} />
        </div>
        <div className="lg:col-span-9">
          {hasAnalyzed && <MLPredictions selectedStocks={selectedStocks} />}
        </div>
      </div>

      {/* ═══ ROW 3: Portfolio + Frontier + Simulation ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PortfolioAllocation selectedStocks={selectedStocks} />
        <EfficientFrontier />
        <InvestmentSimulation />
      </div>

    </div>
  );
}
