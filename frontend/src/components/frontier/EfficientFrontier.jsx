import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Line, ComposedChart, ReferenceDot,
} from "recharts";
import { efficientFrontierData, randomPortfolios, optimalPoint } from "../../data/mockData";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-[#0d1527] border border-slate-800/60 rounded-2xl p-3 shadow-2xl text-xs">
      <p className="text-white font-mono">Risk: <span className="text-amber-400">{d?.risk}%</span></p>
      <p className="text-white font-mono">Return: <span className="text-emerald-400">{d?.return}%</span></p>
    </div>
  );
};

export default function EfficientFrontier() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-semibold text-sm tracking-wide">📈 Efficient Frontier</h2>
        <div className="flex items-center gap-3 text-[9px]">
          <span className="flex items-center gap-1 text-slate-500"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block" /> Random</span>
          <span className="flex items-center gap-1 text-cyan-400"><span className="w-2.5 h-0.5 bg-cyan-400 inline-block rounded" /> Frontier</span>
          <span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Optimal</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.15)" />
          <XAxis type="number" dataKey="risk" domain={[3, 30]} tick={{ fill: "#334155", fontSize: 9 }} tickLine={false} axisLine={false} />
          <YAxis type="number" dataKey="return" domain={[1, 22]} tick={{ fill: "#334155", fontSize: 9 }} tickLine={false} axisLine={false} width={28} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={randomPortfolios} fill="#1e293b" opacity={0.6} />
          <Line data={efficientFrontierData} type="monotone" dataKey="return" stroke="#22d3ee" strokeWidth={2} dot={false} />
          <ReferenceDot x={optimalPoint.risk} y={optimalPoint.return} r={7} fill="#fbbf24" stroke="#fde68a" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
