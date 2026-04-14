import { Bell, User, ChevronDown, Zap, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { LIGHT, DARK } from "../../theme/tokens";

const navItems = [
  { label: "Chart AI", page: "ma-chart" },
  { label: "Technical", page: "ma-technical" },
  { label: "Sentiment", page: "ma-sentiment" },
  { label: "History", page: "ma-history" },
  { label: "Market", page: "ma-market" },
  { label: "Report", page: "ma-report" },
];

export default function Navbar({ activePage, setActivePage }) {
  const { isDark, toggle } = useTheme();
  const t = isDark ? DARK : LIGHT;

  return (
    <nav
      style={{
        zIndex: 9000,
        height: 76,
        borderBottom: `1px solid ${t.border}`,
        background: t.card,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-4 px-4 sm:gap-8 sm:px-6 lg:px-8">
        
        {/* Left Side */}
        <div
          className="flex items-center gap-3 shrink-0 cursor-pointer select-none"
          onClick={() => setActivePage("ma-chart")}
        >
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${t.primary}, #c026d3)`, display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${t.primary}40` }}>
            <Zap size={20} color="#fff" fill="#fff" />
          </div>
          <div style={{ lineHeight: 1 }}>
            <span style={{ color: t.textPrimary, fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em" }}>
              Smart<span style={{ color: t.primary }}>Invest</span>
            </span>
            <p className="hidden sm:block" style={{ color: t.textSecondary, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 4, fontWeight: 700 }}>
              Multi-AI Terminal
            </p>
          </div>
        </div>

        {/* Center */}
        <div className="hidden lg:flex flex-none justify-center px-2">
          <div style={{ display: "flex", alignItems: "center", gap: 4, borderRadius: 9999, border: `1px solid ${t.border}`, background: t.badgeBg, padding: 4 }}>
            {navItems.map((item) => {
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => setActivePage(item.page)}
                  style={{
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 9999,
                    border: "none",
                    whiteSpace: "nowrap",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                    padding: "0 20px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: isActive ? t.activePillBg : "transparent",
                    color: isActive ? t.activePillText : t.textSecondary,
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-end shrink-0 gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggle}
            style={{
              width: 40, height: 40, borderRadius: 12, background: t.hoverBg, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s"
            }}
          >
            {isDark ? <Sun size={18} color={t.warning} /> : <Moon size={18} color={t.primary} />}
          </button>

          {/* Bell */}
          <button className="hidden sm:flex" style={{ position: "relative", width: 40, height: 40, borderRadius: 12, background: t.hoverBg, border: `1px solid ${t.border}`, alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Bell size={18} color={t.textSecondary} />
            <span style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, background: t.primary, borderRadius: "50%", border: `2px solid ${t.card}` }} />
          </button>

          {/* User Profile */}
          <button style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 12px 4px 4px", borderRadius: 14, background: t.hoverBg, border: `1px solid ${t.border}`, cursor: "pointer" }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: t.badgeBg, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={16} color={t.textSecondary} />
            </div>
            <div className="hidden sm:block text-left" style={{ lineHeight: 1.2 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: t.textPrimary, margin: 0 }}>Portfolio</p>
              <p style={{ fontSize: 10, color: t.textSecondary, margin: 0, marginTop: 2 }}>Live</p>
            </div>
            <ChevronDown size={14} color={t.textSecondary} style={{ marginLeft: 4 }} />
          </button>
        </div>
      </div>
    </nav>
  );
}
