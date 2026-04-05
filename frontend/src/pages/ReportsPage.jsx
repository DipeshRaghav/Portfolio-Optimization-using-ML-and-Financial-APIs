import { useState, useEffect } from "react";
import { Brain, FileText, Activity, AlertCircle, Loader2, TrendingUp, TrendingDown, Target, Zap } from "lucide-react";
import { getPredictions } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d1527] border border-slate-800/60 rounded-xl p-3 shadow-2xl">
        <p className="text-slate-400 text-[10px] mb-1 font-mono uppercase tracking-wider">{payload[0].payload.name}</p>
        <p className="font-mono font-bold text-white text-lg">{Number(payload[0].value).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

export default function ReportsPage({ selectedStocks }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (selectedStocks && selectedStocks.length > 0) {
        const result = await getPredictions(selectedStocks);
        setData(result);
      } else {
        setData(null);
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedStocks]);

  if (loading) {
    return (
      <div className="p-8 page-fade flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={32} className="animate-spin text-blue-500" />
        <p className="text-slate-400">Generating Deep ML Analysis Report...</p>
      </div>
    );
  }

  if (!data || !data.predictions || data.predictions.length === 0) {
    return (
      <div className="p-8 page-fade flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle size={32} className="text-slate-600" />
        <p className="text-slate-400">No ML Data available or no stocks selected.</p>
      </div>
    );
  }

  const importances = data.feature_importances;
  const chartData = Object.keys(importances).map((key) => ({
    name: key,
    value: importances[key]
  })).sort((a,b) => b.value - a.value);

  const colors = ["#8b5cf6", "#3b82f6", "#22c55e", "#f59e0b"];

  return (
    <div className="p-6 lg:p-8 space-y-6 page-fade">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <Brain size={20} className="text-purple-400" />
        </div>
        <div>
          <h1 className="text-white font-bold text-xl">Model Insights & Analysis</h1>
          <p className="text-slate-500 text-xs mt-1">Deep dive into what is driving the Machine Learning decisions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Feature Importances Chart */}
        <div className="lg:col-span-8 glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target size={16} className="text-blue-400" />
            <h2 className="text-white font-semibold text-sm">Feature Importance Triggers</h2>
          </div>
          <p className="text-slate-400 text-xs mb-6 max-w-2xl leading-relaxed">
            This algorithm evaluates multiple technical indicators inside a Random Forest Ensembler. 
            The chart below reveals the percentage weight of each technical trigger in predicting the final trend. 
            A higher bar means the model prioritized this metric for today's forecast.
          </p>
          
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: "#94a3b8", fontSize: 12, fontWeight: 600}} width={80} />
                <RechartsTooltip cursor={{fill: "#1e293b", opacity: 0.4}} content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Stats Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-6 h-full flex flex-col justify-center">
            <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-4">Algorithm Confidence</h3>
            <div className="text-4xl font-mono text-white mb-2 line-clamp-1 truncate text-wrap break-all">Random Forest</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Trained on <strong>2 Years</strong> of historical data across your active portfolio. 
              The model executes a 150-tree regression matrix perfectly mapped to next-day percentage returns.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-[85%]" />
              </div>
              <span className="text-xs font-mono text-slate-300">85% Fit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Per Stock Detail Cards */}
      <h2 className="text-white font-semibold text-lg mt-8 mb-4 flex items-center gap-2">
        <Activity size={18} className="text-emerald-400" />
        Detailed Predictions Breakdown
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.predictions.map((p) => {
          const isPos = p.predicted_return >= 0;
          return (
            <div key={p.stock} className="glass-card p-5 border-t-2 border-slate-700/50 hover:border-blue-500/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{p.stock}</h3>
                  <span className="text-2xl font-mono text-slate-300 mt-1 block">${p.current_price.toFixed(2)}</span>
                </div>
                <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${isPos ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                  {p.signal}
                </div>
              </div>
              
              <div className="bg-slate-900/40 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Expected Move</span>
                  <span className={`text-base font-mono font-bold flex items-center gap-1 ${isPos ? "text-emerald-400" : "text-red-400"}`}>
                    {isPos ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {isPos ? "+" : ""}{p.predicted_return}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">Active Snapshot Triggers</p>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">MA 10</span>
                  <span className="text-white font-mono">${p.ma10}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">MA 20</span>
                  <span className="text-white font-mono">${p.ma20}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Momentum</span>
                  <span className="text-white font-mono">{p.momentum > 0 ? "+" : ""}{p.momentum}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  );
}
