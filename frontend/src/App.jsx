import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import TickerBar from "./components/layout/TickerBar";
import DashboardPage from "./pages/DashboardPage";
import MarketAnalysisPage from "./pages/MarketAnalysisPage";
import PortfolioPage from "./pages/PortfolioPage";
import RiskPage from "./pages/RiskPage";
import ReportsPage from "./pages/ReportsPage";
import SimulationPage from "./pages/SimulationPage";

const PAGE_MAP = {
  dashboard: DashboardPage,
  market: MarketAnalysisPage,
  portfolio: PortfolioPage,
  risk: RiskPage,
  reports: ReportsPage,
  simulation: SimulationPage,
};

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const ActivePage = PAGE_MAP[activePage] ?? DashboardPage;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-200 flex flex-col">
      {/* Top Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />


      {/* Live Ticker */}
      <TickerBar />

      {/* Body: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <Sidebar activePage={activePage} setActivePage={setActivePage} />
        </div>

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          <ActivePage />
        </main>
      </div>
    </div>
  );
}