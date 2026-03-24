import { Globe, ShieldAlert, Search, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface VTReputationCardProps {
  data?: {
    malicious: number;
    suspicious: number;
    undetected: number;
    harmless: number;
    total_engines: number;
  };
}

const VTReputationCard = ({ data }: VTReputationCardProps) => {
  if (!data) return (
    <div className="glass-card p-6 h-full flex flex-col items-center justify-center opacity-40 border-dashed">
      <Globe className="w-8 h-8 text-slate-300 mb-2" />
      <span className="label-caps !text-[9px] text-center">Global Reputation Offline</span>
    </div>
  );

  return (
    <div className="glass-card p-6 h-full relative overflow-hidden group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600" />
          <h3 className="label-caps !text-slate-900 !text-[11px] tracking-[3px]">Global Intel</h3>
          
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 cursor-help transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-white border-slate-200">
                <p className="w-56 text-[11px] font-bold text-slate-600 leading-relaxed">Cross-references this file's SHA-256 hash against VirusTotal's global threat intelligence database, querying 70+ antivirus engines simultaneously.</p>
              </TooltipContent>
            </Tooltip>
          
        </div>
        <div className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-[9px] font-black text-blue-600 uppercase tracking-widest">
          VirusTotal v3
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl shadow-inner relative overflow-hidden">
          <div className="relative z-10 text-left">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Detections</span>
              
                <Tooltip>
                  <TooltipTrigger asChild><Info className="w-3 h-3 text-slate-300 hover:text-red-500 cursor-help" /></TooltipTrigger>
                  <TooltipContent side="top" className="bg-white border-slate-200">
                    <p className="w-48 text-[11px] font-bold text-slate-600">Number of antivirus engines that flagged this file as malicious / total engines queried.</p>
                  </TooltipContent>
                </Tooltip>
              
            </div>
            <span className={cn(
              "text-3xl font-black data-mono leading-none",
              data.malicious > 0 ? "text-red-600" : "text-emerald-600"
            )}>
              {data.malicious}<span className="text-sm text-slate-300 ml-1">/ {data.total_engines}</span>
            </span>
          </div>
          <div className="absolute right-2 bottom-2 opacity-10">
             <ShieldAlert className="w-12 h-12 text-slate-900" />
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl shadow-inner relative overflow-hidden">
          <div className="relative z-10 text-left">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Suspicious</span>
              
                <Tooltip>
                  <TooltipTrigger asChild><Info className="w-3 h-3 text-slate-300 hover:text-amber-500 cursor-help" /></TooltipTrigger>
                  <TooltipContent side="top" className="bg-white border-slate-200">
                    <p className="w-48 text-[11px] font-bold text-slate-600">Engines that identified anomalous behavior without a definitive malware signature. Warrants closer investigation.</p>
                  </TooltipContent>
                </Tooltip>
              
            </div>
            <span className="text-3xl font-black data-mono text-slate-900 leading-none">
              {data.suspicious}
            </span>
          </div>
          <div className="absolute right-2 bottom-2 opacity-10">
             <Search className="w-12 h-12 text-slate-900" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
          <div className="flex items-center gap-1">
            <span>Engine Breakdown</span>
            
              <Tooltip>
                <TooltipTrigger asChild><Info className="w-3 h-3 text-slate-300 hover:text-blue-500 cursor-help" /></TooltipTrigger>
                <TooltipContent side="top" className="bg-white border-slate-200">
                  <p className="w-48 text-[11px] font-bold text-slate-600">Red = Malicious detections · Amber = Suspicious flags · The percentage shows the consensus malicious match rate.</p>
                </TooltipContent>
              </Tooltip>
            
          </div>
          <span>{((data.malicious / data.total_engines) * 100).toFixed(0)}% Match</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner flex">
          <div 
            className="h-full bg-red-500 transition-all duration-1000" 
            style={{ width: `${(data.malicious / data.total_engines) * 100}%` }} 
          />
          <div 
            className="h-full bg-amber-400 transition-all duration-1000" 
            style={{ width: `${(data.suspicious / data.total_engines) * 100}%` }} 
          />
        </div>
        <div className="flex items-center justify-between mt-2">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                 <span className="text-[9px] font-bold text-slate-400 uppercase">{data.harmless} Safe</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                 <span className="text-[9px] font-bold text-slate-400 uppercase">{data.undetected} Clear</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VTReputationCard;
