import { useEffect, useState } from "react";
import { getPredictions } from "../../services/api";
import { Brain, TrendingUp, TrendingDown } from "lucide-react";

const SignalBadge = ({ signal }) => {
  if (signal === "Buy") return <span className="signal-buy">▲ BUY</span>;
  if (signal === "Sell") return <span className="signal-sell">▼ SELL</span>;
  return <span className="signal-hold">— HOLD</span>;
};

const ConfidenceBar = ({ value }) => (
  <div className="flex items-center gap-2.5">
    <div className="flex-1 h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${value}%`,
          background:
            value >= 75 ? "#22c55e" : value >= 55 ? "#eab308" : "#ef4444",
        }}
      />
    </div>
    <span className="text-[10px] font-mono text-slate-500 w-8">
      {value}%
    </span>
  </div>
);

export default function MLPredictions({ selectedStocks }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!selectedStocks || selectedStocks.length === 0) {
          setData([]);
          return;
        }
        const result = await getPredictions(selectedStocks);
        console.log("API ML DATA:", result);
        setData(result?.predictions || []);
      } catch (error) {
        console.error("Error loading predictions:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedStocks]);

  // 🔥 Transform API → UI format (SAFE)
  const formattedData = data.map((p) => ({
    stock: p.stock,
    currentPrice: p.current_price.toFixed(2),
    predictedReturn: p.predicted_return.toFixed(2),
    signal: p.signal.includes("BUY") ? "Buy" : p.signal.includes("SELL") ? "Sell" : "Hold",
    confidence: Math.floor(Math.random() * 20) + 70, // dummy confidence until we add predict_proba
  }));

  const shown = formattedData;

  const buyCount = shown.filter((p) => p.signal === "Buy").length;
  const sellCount = shown.filter((p) => p.signal === "Sell").length;
  const holdCount = shown.filter((p) => p.signal === "Hold").length;

  if (loading) {
    return (
      <div className="glass-card p-8 text-white">
        Loading predictions...
      </div>
    );
  }

  return (
    <div className="glass-card p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center">
            <Brain size={16} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm tracking-wide">
              ML Predictions
            </h2>
            <p className="text-slate-600 text-[10px] mt-0.5">
              Next Session
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="signal-buy">BUY {buyCount}</span>
          <span className="signal-sell">SELL {sellCount}</span>
          <span className="signal-hold">HOLD {holdCount}</span>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="text-center py-10 text-slate-600 text-sm">
          No predictions available
        </div>
      ) : (
        <table className="w-full data-table">
          <thead>
            <tr>
              <th className="text-left rounded-tl-xl">Stock</th>
              <th className="text-right">Current</th>
              <th className="text-right">Predicted Δ</th>
              <th className="text-center">Signal</th>
              <th className="text-left rounded-tr-xl">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((p) => {
              const predicted = parseFloat(p.predictedReturn);
              const isPos = predicted >= 0;

              return (
                <tr key={p.stock}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <span className="text-blue-400 text-[10px] font-bold">
                          {p.stock[0]}
                        </span>
                      </div>
                      <span className="font-semibold text-white">
                        {p.stock}
                      </span>
                    </div>
                  </td>

                  <td className="text-right font-mono text-slate-300">
                    ${p.currentPrice}
                  </td>

                  <td className="text-right">
                    <span
                      className={`flex items-center justify-end gap-1 font-semibold font-mono ${
                        isPos ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {isPos ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      )}
                      {isPos ? "+" : ""}
                      {p.predictedReturn}%
                    </span>
                  </td>

                  <td className="text-center">
                    <SignalBadge signal={p.signal} />
                  </td>

                  <td className="min-w-[120px]">
                    <ConfidenceBar value={p.confidence} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="mt-5 pt-4 border-t border-slate-800/20 text-right">
        <span className="text-slate-600 text-[10px]">
          Model: ML-Based Prediction Engine
        </span>
      </div>
    </div>
  );
}