import { FileText, Download, TrendingUp, PieChart, ShieldCheck } from "lucide-react";

const reports = [
  {
    title: "Portfolio Performance Report",
    desc: "Monthly summary of portfolio performance, returns, and benchmark comparison.",
    icon: TrendingUp,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    date: "Apr 01, 2026",
    size: "2.4 MB",
    type: "PDF",
  },
  {
    title: "Risk Assessment Report",
    desc: "Comprehensive risk analysis including VaR, Sharpe Ratio, and stress tests.",
    icon: ShieldCheck,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    date: "Mar 28, 2026",
    size: "1.8 MB",
    type: "PDF",
  },
  {
    title: "Portfolio Optimization Report",
    desc: "Efficient frontier analysis and Markowitz optimization results.",
    icon: PieChart,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    date: "Mar 25, 2026",
    size: "3.1 MB",
    type: "XLSX",
  },
  {
    title: "ML Prediction Accuracy Report",
    desc: "Backtest results and LSTM model accuracy metrics across stocks.",
    icon: FileText,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    date: "Mar 20, 2026",
    size: "0.9 MB",
    type: "PDF",
  },
];

const summaryStats = [
  { label: "Total Portfolio ROI", value: "+18.4%", sub: "Since inception" },
  { label: "Best Performing Stock", value: "NVDA", sub: "+31.2% YTD" },
  { label: "Worst Performing Stock", value: "TSLA", sub: "-12.4% YTD" },
  { label: "Rebalances This Year", value: "4", sub: "Last: Mar 15" },
];

export default function ReportsPage() {
  return (
    <div className="p-5 space-y-5 page-fade">
      <div className="flex items-center gap-2 mb-2">
        <FileText size={20} className="text-blue-400" />
        <h1 className="text-white font-bold text-xl">Reports</h1>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-slate-500 text-xs uppercase tracking-wider">{s.label}</p>
            <p className="text-white font-bold text-2xl font-mono mt-1">{s.value}</p>
            <p className="text-slate-500 text-xs mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Report Cards */}
      <div className="glass-card p-5">
        <h2 className="text-white font-semibold text-base mb-4">Generated Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.title}
                className={`${r.bg} border ${r.border} rounded-xl p-5 flex gap-4 hover:scale-[1.01] transition-all cursor-pointer`}
              >
                <div className={`w-10 h-10 ${r.bg} border ${r.border} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={r.color} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm">{r.title}</h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{r.desc}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-slate-600 text-[10px]">{r.date}</span>
                    <span className="text-slate-600 text-[10px]">·</span>
                    <span className="text-slate-600 text-[10px]">{r.size}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.bg} ${r.color}`}>{r.type}</span>
                  </div>
                </div>
                <button className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 flex items-center justify-center transition-all">
                  <Download size={14} className="text-slate-400 hover:text-white" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Log */}
      <div className="glass-card p-5">
        <h2 className="text-white font-semibold text-base mb-4">Activity Log</h2>
        <div className="space-y-3">
          {[
            { action: "Portfolio analyzed", detail: "AAPL, MSFT, GOOGL, TSLA", time: "Today, 3:12 PM" },
            { action: "Optimization run", detail: "Max Sharpe Ratio strategy", time: "Today, 2:45 PM" },
            { action: "Simulation executed", detail: "$10,000 over 5 years", time: "Today, 1:30 PM" },
            { action: "Report generated", detail: "Portfolio Performance Report", time: "Apr 01, 9:00 AM" },
            { action: "Stocks added", detail: "Added NVDA to watchlist", time: "Mar 31, 4:20 PM" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-2.5 border-b border-slate-800/50 last:border-0">
              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-slate-200 text-sm font-medium">{item.action}</span>
                <span className="text-slate-500 text-xs ml-2">— {item.detail}</span>
              </div>
              <span className="text-slate-600 text-xs flex-shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
