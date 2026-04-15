import {
  LayoutDashboard,
  BarChart3,
  PieChart,
  ShieldAlert,
  FlaskConical,
  FileText,
} from "lucide-react";

/**
 * NAVIGATION CONFIGURATION
 * Each object defines the visual icon, the text label for the tooltip, 
 * and the unique page identifier used for routing/state management.
 */
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", page: "dashboard" },
  { icon: BarChart3, label: "Analytics", page: "market" },
  { icon: PieChart, label: "Portfolio", page: "portfolio" },
  { icon: ShieldAlert, label: "Risk", page: "risk" },
  { icon: FileText, label: "Reports", page: "reports" },
];

/**
 * SIDEBAR COMPONENT
 * @param {string} activePage - The current page ID to highlight the active button.
 * @param {function} setActivePage - State setter function to handle navigation clicks.
 */
export default function Sidebar({ activePage, setActivePage }) {
  return (
    /* ASIDE CONTAINER
       Fixed width (w-16), dark high-contrast background with 90% opacity, 
       and a subtle backdrop-blur for that modern "glass" terminal feel. 
    */
    <aside className="w-16 bg-[#0a1628]/90 border-r border-slate-800/40 flex flex-col items-center backdrop-blur-sm h-full shrink-0 py-10 z-[100]">
      
      {/* VERTICAL BUTTON STACK */}
      <div className="flex flex-col gap-4 items-center">
        {navItems.map((item) => {
          // Dynamically assign the icon component from the map
          const Icon = item.icon;
          // Determine if this specific button matches the current application state
          const isActive = activePage === item.page;

          return (
            /* INDIVIDUAL NAV BUTTON
               The 'group' class is crucial here as it allows the child tooltip 
               div to react when the user hovers over this parent button.
            */
            <button
              key={item.page}
              onClick={() => setActivePage(item.page)}
              className={`relative group w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? "bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10" // Active Style: Glowing blue tint
                  : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/60" // Idle Style: Muted slate
              }`}
            >
              {/* THE ICON: Rendered at a fixed size of 18px */}
              <Icon size={18} />

              {/* TOOLTIP: 
                  - Positioning: 'absolute left-full' puts it to the right of the sidebar.
                  - Animation: Uses 'opacity-0' and 'translate-x-1' by default.
                  - Trigger: 'group-hover' toggles visibility and slides it into place (translate-x-0).
                  - High Z-Index: Ensures the tooltip floats above all other dashboard content.
              */}
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
