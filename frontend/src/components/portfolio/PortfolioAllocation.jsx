import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { defaultAllocation, optimizedAllocation } from "../../data/mockData";
import { Sparkles, RefreshCw } from "lucide-react";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-[#0d1527] border border-slate-800/60 rounded-2xl p-3 shadow-2xl text-sm">
      <p className="font-bold text-white">{d.name}</p>
      <p className="text-slate-300 font-mono">{d.value}%</p>
    </div>
  );
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  if (value < 8) return null;
  return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>{value}%</text>;
};

export default function PortfolioAllocation({ selectedStocks, data: optData }) {
  const [isOptimized, setIsOptimized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const baseData = selectedStocks.length > 0
    ? selectedStocks.map((s, i) => ({
        name: s,
        value: Math.round(100 / selectedStocks.length + (i % 2 === 0 ? 2 : -2)),
        color: ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4"][i % 6],
      }))
    : defaultAllocation;

  const realOptimizedData = optData?.allocation?.map((item, i) => ({
    name: item.name,
    value: Math.round(item.value),
    color: ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4"][i % 6] || "#a855f7",
  })) || optimizedAllocation;

  const data = isOptimized ? realOptimizedData : baseData;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => { setIsOptimized(true); setIsGenerating(false); }, 1800);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-semibold text-sm tracking-wide">📊 Portfolio Allocation</h2>
        {isOptimized && (
          <button onClick={() => setIsOptimized(false)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors">
            <RefreshCw size={11} /> Reset
          </button>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="w-[160px] shrink-0">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value" labelLine={false} label={CustomLabel}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
              <span className="text-slate-300 text-xs font-medium flex-1">{item.name}</span>
              <div className="flex-1 h-1 bg-slate-800/40 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
              </div>
              <span className="text-white font-mono text-xs w-8 text-right">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {!isOptimized && (
        <button onClick={handleGenerate} disabled={isGenerating} className="btn-primary w-full mt-5 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2">
          {isGenerating ? <><RefreshCw size={14} className="animate-spin" /> Optimizing...</> : <><Sparkles size={14} /> Generate Optimized Portfolio</>}
        </button>
      )}
    </div>
  );
}
