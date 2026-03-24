import { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, Activity, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const AlertsFeed = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    
    // Subscribe to new high-threat scans
    const channel = supabase
      .channel('alerts_feed_updates')
      .on('postgres_changes' as any, { event: 'INSERT', table: 'scans' }, (payload: any) => {
        if (payload.new.threat_score > 70) {
          setAlerts(prev => [payload.new, ...prev].slice(0, 5));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .gt('threat_score', 70)
        .order('timestamp', { ascending: false })
        .limit(5);

      if (error) throw error;
      if (data) setAlerts(data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card h-full flex flex-col relative overflow-hidden group">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <h3 className="label-caps !text-slate-900 !text-[11px] tracking-[3px]">High-Threat Vectors</h3>
          
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 text-slate-300 hover:text-red-500 cursor-help transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Live feed of files scanned with a threat score above 70. Updates in real-time via Supabase the moment a new malicious file is detected.</p>
              </TooltipContent>
            </Tooltip>
          
        </div>
        <div className="animate-pulse">
           <div className="w-2 h-2 rounded-full bg-red-600" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {loading ? (
          <div className="h-full flex items-center justify-center py-12">
            <Activity className="w-5 h-5 text-red-200 animate-spin" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 italic py-12">
             <span className="text-[10px] uppercase tracking-widest font-bold">No Active Threats</span>
          </div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert.id}
              className="p-4 rounded-xl border border-red-100 bg-red-50/30 hover:bg-red-50 transition-all duration-300 relative overflow-hidden group/alert"
            >
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center shrink-0 shadow-lg shadow-red-200 group-hover/alert:scale-110 transition-transform">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-black text-red-900 uppercase tracking-tight truncate">
                      {alert.filename || alert.file_name}
                    </span>
                    <span className="text-[8px] font-black text-red-600/60 uppercase">
                      Score: {alert.threat_score}
                    </span>
                  </div>
                  <p className="text-[9px] font-bold text-red-800/60 uppercase tracking-widest line-clamp-1">
                    Neural match: {alert.prediction?.split(' ')[0] || 'Malicious Payload'}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                     <span className="data-mono text-[8px] text-red-400 truncate bg-white/50 px-1.5 py-0.5 rounded border border-red-50 inline-block max-w-full overflow-hidden">
                        {alert.file_hash}
                     </span>
                  </div>
                </div>
              </div>
              
              {/* Tactical alert detail */}
              <div className="absolute top-0 right-0 w-8 h-8 opacity-5">
                 <AlertTriangle className="w-full h-full text-red-900" />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 bg-red-600/5 text-center border-t border-red-100">
         <span className="text-[8px] font-black text-red-800 uppercase tracking-[4px]">Live Inference Monitor Active</span>
      </div>
    </div>
  );
};

export default AlertsFeed;
