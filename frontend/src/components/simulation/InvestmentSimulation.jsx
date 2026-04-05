import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { generateSimulation } from "../../data/mockData";
import { DollarSign, Clock, Play, TrendingUp } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1527] border border-slate-800/60 rounded-2xl p-3 shadow-2xl text-xs">
      <p className="text-slate-500 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-mono font-semibold">${p.value?.toLocaleString()}</p>
      ))}
    </div>
  );
};

export default function InvestmentSimulation() {
  const [investment, setInvestment] = useState(100000);
  const [years, setYears] = useState(10);
  const [hasRun, setHasRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [simData, setSimData] = useState([]);

  const handleSimulate = () => {
    setIsRunning(true);
    setTimeout(() => {
      setSimData(generateSimulation(investment, years, 14.7, 8.3));
      setHasRun(true);
      setIsRunning(false);
    }, 900);
  };

  const finalValue = simData[simData.length - 1]?.value ?? 0;
  const totalReturn = investment ? (((finalValue - investment) / investment) * 100).toFixed(1) : "0.0";
  const isProfit = finalValue > investment;

  return (
    <div className="glass-card p-6">
      <h2 className="text-white font-semibold text-sm tracking-wide mb-5 flex items-center gap-2">
        <TrendingUp size={14} className="text-blue-400" /> Investment Simulation
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-[9px] uppercase tracking-[2px] text-slate-600 font-semibold mb-1.5 block">
            <DollarSign size={9} className="inline mr-0.5" /> Initial Investment
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs">$</span>
            <input type="number" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} className="smart-input pl-7 py-2.5 text-sm" min={100} step={1000} />
          </div>
        </div>
        <div>
          <label className="text-[9px] uppercase tracking-[2px] text-slate-600 font-semibold mb-1.5 block">
            <Clock size={9} className="inline mr-0.5" /> Time Horizon (Years)
          </label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="smart-input py-2.5 text-sm" min={1} max={30} />
        </div>
      </div>

      <button onClick={handleSimulate} disabled={isRunning} className="btn-primary w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2">
        {isRunning ? <><span className="spinner" /> Running...</> : <><Play size={13} fill="white" /> Run Simulation</>}
      </button>

      {hasRun && simData.length > 0 && (
        <div className="mt-5 pt-5 border-t border-slate-800/20 page-fade">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-900/30 rounded-2xl p-4 text-center border border-slate-800/15">
              <p className="text-slate-600 text-[9px] uppercase tracking-wider">Final Value</p>
              <p className={`font-mono font-bold text-lg mt-1 ${isProfit ? "text-emerald-400" : "text-red-400"}`}>${Math.round(finalValue).toLocaleString()}</p>
            </div>
            <div className="bg-slate-900/30 rounded-2xl p-4 text-center border border-slate-800/15">
              <p className="text-slate-600 text-[9px] uppercase tracking-wider">Total Return</p>
              <p className={`font-mono font-bold text-lg mt-1 ${isProfit ? "text-emerald-400" : "text-red-400"}`}>{isProfit ? "+" : ""}{totalReturn}%</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={simData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="simGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.15)" />
              <XAxis dataKey="label" tick={{ fill: "#334155", fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#334155", fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#simGrad2)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
