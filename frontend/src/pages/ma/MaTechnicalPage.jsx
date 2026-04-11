import { Wrench } from "lucide-react";
import MaControlBar from "../../components/multimodel/MaControlBar";
import MaEmptyState from "../../components/multimodel/MaEmptyState";
import MaPageHero from "../../components/multimodel/MaPageHero";
import MaReasonsPanel from "../../components/multimodel/MaReasonsPanel";
import MaSignalCard from "../../components/multimodel/MaSignalCard";
import { MaError, MaLoading } from "../../components/multimodel/MaStatus";
import { useMultiAI } from "../../context/MultiAIContext";

export default function MaTechnicalPage() {
  const { data, loading } = useMultiAI();
  const reasons = data?.reasons?.technical || [];
  const prob = data?.models?.indicator?.prob_up;

  return (
    <div className="space-y-6 py-5 pb-16 md:py-8">
      <MaPageHero
        icon={Wrench}
        accent="cyan"
        badge="Indicators"
        title="Technical analysis"
        highlight="analysis"
        subtitle="RSI, MACD, Bollinger bands, and moving averages — distilled into a bullish probability for the next move."
      />
      <MaControlBar />
      <MaLoading />
      <MaError />
      {!loading && data && (
        <div className="space-y-6">
          <MaSignalCard
            label="Indicator model — P(up)"
            prob={prob}
            tint="cyan"
            footnote="XGBoost on engineered technical features."
          />
          <MaReasonsPanel
            title="Drivers behind the signal"
            subtitle="Rule-style readout from the latest bar"
            reasons={reasons}
          />
        </div>
      )}
      {!loading && !data && <MaEmptyState />}
    </div>
  );
}
