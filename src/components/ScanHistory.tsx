import { useState, useEffect } from 'react';
import { History as HistoryIcon, Activity, ShieldCheck, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import type { ScanResult } from '@/lib/mock-data';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ScanHistoryProps {
  onSelectScan: (scan: ScanResult) => void;
}

const ScanHistory = ({ onSelectScan }: ScanHistoryProps) => {
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
    
    // Subscribe to new scans
    const channel = supabase
      .channel('history_updates')
      .on('postgres_changes' as any, { event: 'INSERT', table: 'scans' }, () => {
        fetchHistory();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) throw error;
      if (data) setHistory(data as any);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card h-full flex flex-col relative overflow-hidden group">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50">
        <div className="flex items-center gap-3">
          <HistoryIcon className="w-4 h-4 text-blue-600" />
          <h3 className="label-caps !text-slate-900 !text-[11px] tracking-[3px]">Historical Archive</h3>
          
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 text-slate-300 hover:text-blue-500 cursor-help transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-white border-slate-200">
                <p className="w-52 text-[11px] font-bold text-slate-600 leading-relaxed">All previous scans persisted in Supabase. Click any record to instantly reload that scan's full analysis into the main workspace.</p>
              </TooltipContent>
            </Tooltip>
          
        </div>
        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
           {loading ? 'Synchronizing...' : `${history.length} Records`}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-200 animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 italic py-12">
             <span className="text-[10px] uppercase tracking-widest font-bold">No Records Found</span>
          </div>
        ) : (
          <div className="space-y-1">
            {history.map((scan: any) => (
              <button
                key={scan.id}
                onClick={() => {
                  const resultData = typeof scan.result_json === 'string' 
                    ? JSON.parse(scan.result_json) 
                    : scan.result_json;
                  onSelectScan(resultData || scan);
                }}
                className="w-full group/item flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-slate-50 border border-transparent hover:border-slate-100 text-left"
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs shrink-0 shadow-sm transition-transform group-hover/item:scale-105",
                  Number(scan.threat_score) >= 70 ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                )}>
                  {scan.threat_score}
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tight">
                      {scan.filename || scan.file_name}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">
                      {new Date(scan.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="data-mono text-[9px] text-slate-400 truncate">
                      {scan.file_hash}
                    </span>
                  </div>
                </div>

                <div className={cn(
                  "hidden group-hover/item:flex items-center justify-center w-8 h-8 rounded-full",
                  Number(scan.threat_score) >= 70 ? "bg-red-50" : "bg-emerald-50"
                )}>
                   {Number(scan.threat_score) >= 70 ? (
                     <Activity className="w-4 h-4 text-red-600" />
                   ) : (
                     <ShieldCheck className="w-4 h-4 text-emerald-600" />
                   )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-center gap-4">
         <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Clean</span>
         </div>
         <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Threat</span>
         </div>
      </div>
    </div>
  );
};

export default ScanHistory;
