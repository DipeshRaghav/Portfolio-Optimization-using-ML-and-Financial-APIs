import {
  CandlestickChart,
  Wrench,
  MessageCircle,
  History,
  Globe,
  FileCheck,
} from "lucide-react";

const navItems = [
  { icon: CandlestickChart, label: "Chart AI", page: "ma-chart" },
  { icon: Wrench, label: "Technical", page: "ma-technical" },
  { icon: MessageCircle, label: "Sentiment", page: "ma-sentiment" },
  { icon: History, label: "History", page: "ma-history" },
  { icon: Globe, label: "Market", page: "ma-market" },
  { icon: FileCheck, label: "Report", page: "ma-report" },
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="w-16 bg-[#080d18]/95 border-r border-white/[0.05] flex flex-col items-center backdrop-blur-xl h-full shrink-0 py-10 z-[100]">
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
                  ? "bg-violet-500/25 text-violet-300 shadow-lg shadow-violet-500/15 ring-1 ring-violet-400/25"
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.06]"
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
