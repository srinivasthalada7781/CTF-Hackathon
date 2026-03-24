import { useState, useEffect } from 'react';
import { Bell, ShieldCheck, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const DashboardHeader = () => {
  const [highAlerts, setHighAlerts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlertCount();
    
    // Subscribe to new high-threat scans
    const channel = supabase
      .channel('header_alerts')
      .on('postgres_changes', { event: 'INSERT', table: 'scans' }, (payload) => {
        if (payload.new.threat_score > 70) {
          setHighAlerts(prev => prev + 1);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAlertCount = async () => {
    try {
      const { count, error } = await supabase
        .from('scans')
        .select('*', { count: 'exact', head: true })
        .gt('threat_score', 70);

      if (error) throw error;
      if (count !== null) setHighAlerts(count);
    } catch (err) {
      console.error('Error fetching alert count:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Live</span>
        </div>

        <div className="h-8 w-[1px] bg-slate-100 hidden md:block" />

        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Traffic Analysis</span>
              
                <Tooltip>
                  <TooltipTrigger asChild><Info className="w-3 h-3 text-slate-300 hover:text-blue-500 cursor-help" /></TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-white border-slate-200">
                    <p className="w-48 text-[11px] font-bold text-slate-600">Monitoring the live PE binary intake stream on scanner Node A-12 for suspicious file submissions.</p>
                  </TooltipContent>
                </Tooltip>
              
            </div>
            <span className="text-[10px] font-black text-slate-700 tracking-tight">Active · Node A-12</span>
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Threat Index</span>
              
                <Tooltip>
                  <TooltipTrigger asChild><Info className="w-3 h-3 text-slate-300 hover:text-blue-500 cursor-help" /></TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-white border-slate-200">
                    <p className="w-48 text-[11px] font-bold text-slate-600">Overall risk level of the current scan session based on the ratio of malicious to benign classifications.</p>
                  </TooltipContent>
                </Tooltip>
              
            </div>
            <span className="text-[10px] font-black text-emerald-600 tracking-tight uppercase">Nominal Risk</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg shadow-inner cursor-help">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hidden sm:inline">Hybrid Intelligence</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-white border-slate-200">
              <p className="w-56 text-[11px] font-bold text-slate-600 leading-relaxed">Our engine combines XGBoost ML model probability with a 4-rule heuristic safeguard layer (entropy, API injection, anti-VM, surveillance) to ensure optimal accuracy.</p>
            </TooltipContent>
          </Tooltip>
        
        
        
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all">
                <Bell className="w-4 h-4" />
                {highAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-[8px] font-black text-white">{highAlerts}</span>
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-white border-slate-200">
              <p className="w-48 text-[11px] font-bold text-slate-600">{highAlerts} active high-risk file(s) detected with threat score above 70. These have been escalated to the live vector feed.</p>
            </TooltipContent>
          </Tooltip>
        
      </div>
    </header>
  );
};

export default DashboardHeader;
