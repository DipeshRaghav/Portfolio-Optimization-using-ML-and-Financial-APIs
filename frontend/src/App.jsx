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
import Sidebar from "./components/layout/Sidebar";

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
          <div className="hidden lg:block relative z-[9999] shrink-0 overflow-visible">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
          </div>

          <main className="relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-[#050810]">
            <div className="pointer-events-none fixed inset-0 lg:left-16 overflow-hidden" aria-hidden>
              <div className="absolute -top-32 left-[15%] h-72 w-72 rounded-full bg-violet-600/[0.06] blur-[100px]" />
              <div className="absolute top-1/2 right-0 h-96 w-96 -translate-y-1/2 rounded-full bg-indigo-600/[0.05] blur-[100px]" />
              <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-600/[0.04] blur-[90px]" />
            </div>
            <div key={activePage} className="page-fade relative z-[1] min-h-full">
              <ActivePage />
            </div>
          </main>
        </div>
      </div>
    </MultiAIProvider>
  );
}
