import {
  LayoutDashboard,
  BarChart3,
  PieChart,
  ShieldAlert,
  TrendingUp,
  FlaskConical,
  Settings,
  HelpCircle,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", page: "dashboard" },
  { icon: BarChart3, label: "Analytics", page: "market" },
  { icon: PieChart, label: "Portfolio", page: "portfolio" },
  { icon: ShieldAlert, label: "Risk", page: "risk" },
  { icon: TrendingUp, label: "Simulation", page: "simulation" },
  { icon: FlaskConical, label: "Reports", page: "reports" },
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="w-16 min-h-screen bg-[#0a1628]/90 border-r border-slate-800/40 flex flex-col items-center backdrop-blur-sm sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto shrink-0 py-6">
      <div className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => setActivePage(item.page)}
              title={item.label}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group relative ${
                isActive
                  ? "bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10"
                  : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon size={18} />
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-slate-700/50">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <button title="Settings" className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-slate-800/60 transition-all">
          <Settings size={16} />
        </button>
        <button title="Help" className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-slate-800/60 transition-all">
          <HelpCircle size={16} />
        </button>
      </div>
    </aside>
  );
}
