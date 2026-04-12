import { Bell, Activity, Brain, Volume2, Info, ArrowRight } from "lucide-react";

const feedItems = [
  { 
    id: 1, 
    type: "Signal", 
    msg: "RSI Oversold on AAPL (4H)", 
    desc: "Relative Strength Index dropped below 30. Potential bottoming pattern identified by momentum divergence.",
    time: "12m ago", 
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    icon: Activity
  },
  { 
    id: 2, 
    type: "Alert", 
    msg: "Unusual Volume Spike: TSLA", 
    desc: "14.2% increase in PM trading volume. Institutional accumulation suspected at current support level.",
    time: "45m ago", 
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    icon: Volume2
  },
  { 
    id: 3, 
    type: "Insight", 
    msg: "Neural Confidence Delta: MSFT", 
    desc: "LSTM-Ensemble prediction confidence increased to 91% for the upcoming 72-hour price trajectory.",
    time: "2h ago", 
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    icon: Brain
  },
];

export default function IntelligenceFeed({ compact = false }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Bell size={16} className="text-blue-400" />
          </div>
          <h3 className="text-slate-100 font-bold text-xs uppercase tracking-widest">Intelligence Feed</h3>
        </div>
        <div className="flex items-center gap-1.5 pointer-events-none">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
           <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {feedItems.map((item) => (
          <div key={item.id} className="group cursor-pointer transition-all">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded border border-current opacity-60 ${item.color}`}>
                  {item.type}
                </span>
                <span className="text-slate-600 text-[9px] font-bold uppercase tracking-widest">{item.time}</span>
              </div>
            </div>
            
            <div className="flex gap-4">
               {/* Icon Side Rail (Only for full view) */}
               {!compact && (
                  <div className={`w-8 h-8 rounded-lg ${item.bg} border border-white/5 shrink-0 flex items-center justify-center`}>
                    <item.icon size={14} className={item.color} />
                  </div>
               )}
               
               <div className="flex flex-col gap-1.5">
                  <h4 className="text-[13px] font-bold text-slate-200 group-hover:text-blue-400 transition-colors leading-tight">
                    {item.msg}
                  </h4>
                  {!compact && (
                    <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">
                      {item.desc}
                    </p>
                  )}
               </div>
            </div>
            
            <div className="h-[1px] w-full bg-white/2 mt-5 group-last:hidden" />
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
         <div className="p-4 rounded-xl bg-white/2 border border-white/5 flex items-start gap-3">
            <Info size={14} className="text-slate-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-600 italic leading-snug">
              Signals derived from institutional order-flow and momentum oscillators.
            </p>
         </div>
         <button className="flex items-center justify-center w-full gap-2 text-[10px] font-bold text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-all">
            Open Global Feed Hub <ArrowRight size={12} />
         </button>
      </div>
    </div>
  );
}
