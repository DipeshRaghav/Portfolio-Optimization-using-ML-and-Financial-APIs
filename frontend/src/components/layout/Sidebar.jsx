import {
  LayoutDashboard,
  BarChart3,
  PieChart,
  ShieldAlert,
  FlaskConical,
  FileText,
  Brain,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", page: "dashboard" },
  { icon: BarChart3, label: "Analytics", page: "market" },
  { icon: PieChart, label: "Portfolio", page: "portfolio" },
  { icon: ShieldAlert, label: "Risk", page: "risk" },
  { icon: Brain, label: "Multi-AI", page: "multimodel" },
  { icon: FlaskConical, label: "Simulation", page: "simulation" },
  { icon: FileText, label: "Reports", page: "reports" },
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
              className={`relative group w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? "bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10"
                  : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon size={18} />

              <div
                className="
                  absolute left-full top-1/2 ml-3 -translate-y-1/2
                  min-w-[96px]
                  px-4 py-2.5
                  rounded-lg
                  bg-slate-900/95
                  text-[#dbe4ff] text-[11px] font-semibold tracking-[0.02em]
                  border border-slate-700
                  shadow-xl
                  whitespace-nowrap
                  flex items-center justify-center
                  text-center
                  leading-[1.2]
                  opacity-0 invisible
                  translate-x-1
                  pointer-events-none
                  group-hover:opacity-100
                  group-hover:visible
                  group-hover:translate-x-0
                  transition-all duration-200
                  z-[9999]
                "
              >
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
