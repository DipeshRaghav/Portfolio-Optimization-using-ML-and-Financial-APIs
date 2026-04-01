import { useState } from "react";
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Search, User } from "lucide-react";

const sampleData = [
  { name: "AAPL", value: 30 },
  { name: "MSFT", value: 25 },
  { name: "GOOGL", value: 20 },
  { name: "TSLA", value: 25 },
];

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

export default function Dashboard() {
  const [stock, setStock] = useState("");

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      {/* 🔷 NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 bg-[#1e293b]">
        <h1 className="text-xl font-bold">💰 SmartInvest</h1>

        <div className="flex items-center gap-6">
          <p>Dashboard</p>
          <p>Market</p>
          <p>Portfolio</p>
          <p>Risk</p>
          <p>Reports</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#0f172a] px-3 py-1 rounded">
            <Search size={16} />
            <input
              className="bg-transparent outline-none ml-2"
              placeholder="Search AAPL..."
            />
          </div>
          <User />
        </div>
      </div>

      {/* 🔷 MAIN GRID */}
      <div className="p-6 grid grid-cols-12 gap-6">

        {/* 🟢 STOCK INPUT */}
        <div className="col-span-12 bg-[#1e293b] p-4 rounded-xl">
          <h2 className="text-lg mb-3">Select Stocks</h2>

          <div className="flex gap-3">
            <input
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Enter ticker (AAPL)"
              className="bg-[#0f172a] px-4 py-2 rounded w-full"
            />
            <button className="bg-blue-500 px-4 py-2 rounded">
              Analyze Portfolio
            </button>
          </div>
        </div>

        {/* 📈 STOCK CHART */}
        <div className="col-span-8 bg-[#1e293b] p-4 rounded-xl">
          <h2 className="mb-3">Stock Price</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[{x:1,y:100},{x:2,y:120},{x:3,y:110}]}>
              <Line type="monotone" dataKey="y" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 📊 TECH INDICATORS */}
        <div className="col-span-4 space-y-4">
          <div className="bg-[#1e293b] p-4 rounded-xl">
            <h3>RSI</h3>
            <p className="text-green-400">62 (Neutral)</p>
          </div>

          <div className="bg-[#1e293b] p-4 rounded-xl">
            <h3>MACD</h3>
            <p className="text-green-400">Positive</p>
          </div>

          <div className="bg-[#1e293b] p-4 rounded-xl">
            <h3>MA20</h3>
            <p className="text-green-400">Bullish</p>
          </div>
        </div>

        {/* 🤖 ML PREDICTIONS */}
        <div className="col-span-6 bg-[#1e293b] p-4 rounded-xl">
          <h2 className="mb-3">ML Predictions</h2>

          <table className="w-full">
            <tbody>
              <tr><td>AAPL</td><td className="text-green-400">+1.2%</td></tr>
              <tr><td>MSFT</td><td className="text-green-400">+1.0%</td></tr>
              <tr><td>TSLA</td><td className="text-red-400">-0.5%</td></tr>
            </tbody>
          </table>
        </div>

        {/* 🥧 PORTFOLIO */}
        <div className="col-span-6 bg-[#1e293b] p-4 rounded-xl">
          <h2>Portfolio Allocation</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={sampleData} dataKey="value">
                {sampleData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 📉 RISK METRICS */}
        <div className="col-span-4 bg-[#1e293b] p-4 rounded-xl">
          <h3>Expected Return</h3>
          <p className="text-green-400">12%</p>
        </div>

        <div className="col-span-4 bg-[#1e293b] p-4 rounded-xl">
          <h3>Volatility</h3>
          <p className="text-yellow-400">8%</p>
        </div>

        <div className="col-span-4 bg-[#1e293b] p-4 rounded-xl">
          <h3>Sharpe Ratio</h3>
          <p className="text-blue-400">1.45</p>
        </div>

        {/* 📊 EFFICIENT FRONTIER */}
        <div className="col-span-6 bg-[#1e293b] p-4 rounded-xl">
          <h2>Efficient Frontier</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={[{x:1,y:5},{x:2,y:8},{x:3,y:10}]}>
              <Line dataKey="y" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 💰 SIMULATION */}
        <div className="col-span-6 bg-[#1e293b] p-4 rounded-xl">
          <h2>Investment Simulation</h2>

          <input
            placeholder="Initial Investment"
            className="bg-[#0f172a] p-2 rounded w-full mb-2"
          />

          <input
            placeholder="Time (years)"
            className="bg-[#0f172a] p-2 rounded w-full mb-2"
          />

          <button className="bg-green-500 px-4 py-2 rounded w-full">
            Simulate
          </button>
        </div>

      </div>

    </div>

  );
}