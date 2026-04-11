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
      <div className="h-screen overflow-hidden bg-[#0a0f1e] text-slate-200 flex flex-col">
        <Navbar activePage={activePage} setActivePage={setActivePage} />
        <TickerBar />

        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block relative z-[9999] overflow-visible">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
          </div>

          <main className="flex-1 overflow-y-auto bg-[#050810] pl-12">
            <ActivePage />
          </main>
        </div>
      </div>
    </MultiAIProvider>
  );
}
