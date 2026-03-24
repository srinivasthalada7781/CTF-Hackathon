import { Binary, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PEAnalysisProps {
  result: any;
}

const PEAnalysis = ({ result }: PEAnalysisProps) => {
  const getEntropyColor = (entropy: number) => {
    if (entropy > 7.0) return 'bg-red-500';
    if (entropy > 6.0) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <div className="glass-card p-6 md:p-8 w-full relative group overflow-hidden border border-blue-100">
      {/* Authentic Blueprint Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#3b82f615_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
        <div className="flex items-center gap-3 shrink-0 min-w-0">
          <Binary className="w-4 h-4 text-blue-600 shrink-0" />
          <h3 className="label-caps !text-slate-900 !text-[11px] tracking-[3px] truncate">Binary Structural Blueprint</h3>
        </div>
        <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-widest shrink-0 self-start sm:self-auto relative z-20">
           Entropy: <span className="text-slate-900">{result.features.entropy.toFixed(2)}</span>
           
             <Tooltip>
               <TooltipTrigger asChild>
                  <Info className="w-3 h-3 text-slate-400 hover:text-blue-600 cursor-help transition-colors ml-1" />
               </TooltipTrigger>
               <TooltipContent side="bottom" className="bg-white border-slate-200 shadow-xl">
                  <p className="w-48 text-[11px] font-bold text-slate-600 leading-relaxed">Shannon Entropy measures randomness. Values &gt; 7.0 strongly indicate obfuscation, packing, or encryption often used by advanced malware payloads.</p>
               </TooltipContent>
             </Tooltip>
           
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8 relative z-10">
        <div className="p-4 rounded-xl border border-blue-100 bg-white/80 backdrop-blur-sm flex flex-col items-start text-left shadow-sm">
           <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1">Entry Point</span>
           <span className="data-mono text-[12px] truncate w-full text-blue-700">{result.features.entryPoint}</span>
        </div>
        <div className="p-4 rounded-xl border border-blue-100 bg-white/80 backdrop-blur-sm flex flex-col items-start text-left shadow-sm">
           <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1">Importer Hash</span>
           <span className="data-mono text-[12px] truncate w-full text-blue-700">{result.features.imphash || 'N/A'}</span>
        </div>
        <div className="p-4 rounded-xl border border-blue-100 bg-white/80 backdrop-blur-sm flex flex-col items-start text-left shadow-sm">
           <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1">Architecture</span>
           <span className="data-mono text-[12px] text-indigo-600 font-black uppercase">x64 Payload</span>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section Analysis</span>
          <span className="text-[9px] font-bold text-slate-300 uppercase">n={result.peAnalysis.length} Total</span>
        </div>
        
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
          {result.peAnalysis.map((section: any, i: number) => (
            <div key={i} className="p-3 rounded-lg border border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300 group/section shadow-sm text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="data-mono text-[12px] font-black text-slate-900">{section.name}</span>
                <span className="data-mono text-[10px] text-slate-400 font-bold">VS: {section.vSize} · RS: {section.rSize}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner flex">
                   <div 
                     className={cn("h-full transition-all duration-1000", getEntropyColor(section.entropy))}
                     style={{ width: `${(section.entropy / 8) * 100}%` }}
                   />
                </div>
                <span className={cn(
                  "data-mono text-[10px] font-black min-w-[30px] text-right",
                  section.entropy > 7.0 ? "text-red-500" : "text-blue-600"
                )}>
                  {section.entropy.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {result.features.suspiciousImports.length > 0 && (
        <div className="mt-8 flex flex-col items-start relative z-10 p-4 rounded-xl border border-red-100 bg-red-50/50">
          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            Compromised API Indicators
          </span>
          <div className="flex flex-wrap gap-2">
            {result.features.suspiciousImports.map((imp: string) => (
              <span key={imp} className="px-3 py-1.5 rounded-lg bg-white border border-red-200 text-[10px] font-black text-red-700 uppercase tracking-widest shadow-sm">
                {imp}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PEAnalysis;
