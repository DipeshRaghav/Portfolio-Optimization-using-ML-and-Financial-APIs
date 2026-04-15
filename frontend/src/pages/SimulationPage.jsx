import { useEffect, useState } from "react";
import EfficientFrontier from "../components/frontier/EfficientFrontier";
import InvestmentSimulation from "../components/simulation/InvestmentSimulation";
import { getOptimizationData } from "../services/api";
import { FlaskConical } from "lucide-react";

export default function SimulationPage({ selectedStocks }) {
  const [optData, setOptData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getOptimizationData(selectedStocks);
      if (!cancelled) setOptData(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedStocks]);

  return (
    <div className="p-5 space-y-5 page-fade">
      <div className="flex items-center gap-2 mb-2">
        <FlaskConical size={20} className="text-blue-400" />
        <h1 className="text-white font-bold text-xl">Simulation & Frontier</h1>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <EfficientFrontier data={optData} />
        <InvestmentSimulation />
      </div>
    </div>
  );
}
