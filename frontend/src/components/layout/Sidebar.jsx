import {
  LayoutDashboard,
  BarChart3,
  PieChart,
  ShieldAlert,
  FlaskConical,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", page: "dashboard" },
  { icon: BarChart3, label: "Analytics", page: "market" },
  { icon: PieChart, label: "Portfolio", page: "portfolio" },
  { icon: ShieldAlert, label: "Risk", page: "risk" },
  { icon: FlaskConical, label: "Reports", page: "reports" },
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="w-16 bg-[#0a1628]/90 border-r border-slate-800/40 flex flex-col items-center backdrop-blur-sm h-full shrink-0 py-10 z-[100]">
      <div className="flex flex-col gap-4 items-center">
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
              <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#4f46e5] text-white font-bold text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-2xl z-[9999] drop-shadow-xl border border-[#4338ca]">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
