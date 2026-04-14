import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import TickerBar from "./components/layout/TickerBar";
import { MultiAIProvider } from "./context/MultiAIContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { LIGHT, DARK } from "./theme/tokens";
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

function AppLayout({ activePage, setActivePage }) {
  const { isDark } = useTheme();
  const t = isDark ? DARK : LIGHT;
  const ActivePage = PAGE_MAP[activePage] ?? MaChartPage;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%", overflow: "hidden", background: t.bg, color: t.textPrimary, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <TickerBar />

      <div style={{ display: "flex", minHeight: 0, width: "100%", flex: 1, overflow: "hidden" }}>
        <main style={{ position: "relative", minHeight: 0, flex: 1, overflowY: "auto", overflowX: "hidden", background: t.bg }}>
          {isDark && (
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
              <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/[0.06] blur-[100px]" />
              <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/[0.05] blur-[100px]" />
              <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-600/[0.04] blur-[90px]" />
            </div>
          )}
          {/* 1fr | content (max 100rem) | 1fr — keeps column centered, fills wide screens */}
          <div className="relative z-[1] grid min-h-full w-full grid-cols-[1fr_min(100%,100rem)_1fr]">
            <div
              key={activePage}
              className="page-fade col-start-2 min-h-full min-w-0 px-5 sm:px-8 lg:px-12 xl:px-16"
            >
              <ActivePage />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("ma-chart");
  const [selectedStocks] = useState(["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN"]);

  return (
    <ThemeProvider>
      <MultiAIProvider initialSymbol={selectedStocks[0] || "AAPL"}>
        <AppLayout activePage={activePage} setActivePage={setActivePage} />
      </MultiAIProvider>
    </ThemeProvider>
  );
}
