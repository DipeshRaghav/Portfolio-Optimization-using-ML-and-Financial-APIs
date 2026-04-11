import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getMultiModelFullReport } from "../services/api";

const MultiAIContext = createContext(null);

export function MultiAIProvider({ children, initialSymbol = "AAPL" }) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [period, setPeriod] = useState("2y");
  const [chartEpochs, setChartEpochs] = useState(4);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastLoadedAt, setLastLoadedAt] = useState(null);
  const didAutoRun = useRef(false);

  const refresh = useCallback(async () => {
    const sym = String(symbol || "AAPL").trim().toUpperCase();
    if (!sym) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getMultiModelFullReport(sym, period, chartEpochs);
      if (res?.error) {
        setData(null);
        setError(res.error);
        return;
      }
      setData(res);
      setLastLoadedAt(new Date().toISOString());
    } catch (e) {
      setData(null);
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }, [symbol, period, chartEpochs]);

  useEffect(() => {
    if (didAutoRun.current) return;
    didAutoRun.current = true;
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      symbol,
      setSymbol,
      period,
      setPeriod,
      chartEpochs,
      setChartEpochs,
      data,
      loading,
      error,
      lastLoadedAt,
      refresh,
    }),
    [symbol, period, chartEpochs, data, loading, error, lastLoadedAt, refresh]
  );

  return <MultiAIContext.Provider value={value}>{children}</MultiAIContext.Provider>;
}

export function useMultiAI() {
  const ctx = useContext(MultiAIContext);
  if (!ctx) throw new Error("useMultiAI must be used inside MultiAIProvider");
  return ctx;
}
