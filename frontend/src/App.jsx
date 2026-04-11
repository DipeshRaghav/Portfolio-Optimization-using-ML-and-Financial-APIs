import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import TickerBar from "./components/layout/TickerBar";
import { MultiAIProvider } from "./context/MultiAIContext";
import MaChartPage from "./pages/ma/MaChartPage";
import MaTechnicalPage from "./pages/ma/MaTechnicalPage";
import MaSentimentPage from "./pages/ma/MaSentimentPage";
import MaHistoryPage from "./pages/ma/MaHistoryPage";
import MaMarketPage from "./pages/ma/MaMarketPage";
import MaReportPage from "./pages/ma/MaReportPage";

const PAGE_MAP = {
  "ma-chart": MaChartPage,
  "ma-technical": MaTechnicalPage,
  "ma-sentiment": MaSentimentPage,
  "ma-history": MaHistoryPage,
  "ma-market": MaMarketPage,
  "ma-report": MaReportPage,
};

export default function App() {
  const [activePage, setActivePage] = useState("ma-chart");
  const [selectedStocks] = useState(["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN"]);

  const ActivePage = PAGE_MAP[activePage] ?? MaChartPage;

  return (
    <MultiAIProvider initialSymbol={selectedStocks[0] || "AAPL"}>
      <div className="h-screen overflow-hidden bg-[#060a14] text-slate-200 flex flex-col">
        <Navbar activePage={activePage} setActivePage={setActivePage} />
        <TickerBar />

        <div className="flex flex-1 min-h-0 overflow-hidden">
          <main className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#050810] [scrollbar-gutter:stable]">
            <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
              <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/[0.06] blur-[100px]" />
              <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/[0.05] blur-[100px]" />
              <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-600/[0.04] blur-[90px]" />
            </div>
            <div
              key={activePage}
              className="page-fade relative z-[1] mx-auto min-h-full w-full max-w-7xl px-4 sm:px-6 lg:px-8"
            >
              <ActivePage />
            </div>
          </main>
        </div>
      </div>
    </MultiAIProvider>
  );
}
