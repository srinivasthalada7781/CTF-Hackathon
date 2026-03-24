import { useState, useEffect } from 'react';
import { ShieldAlert, Bell, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('prediction', 'malicious') // Simplified check, could be more robust
        .order('timestamp', { ascending: false });

      if (error) throw error;

      if (data) {
        setAlerts(data);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="p-6 max-w-[1720px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-destructive" />
          <h1 className="text-2xl font-bold text-foreground">Threat Alerts</h1>
        </div>
        <button onClick={fetchAlerts} className="p-2 hover:bg-muted rounded-full transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="bg-muted/30 p-4 border-b border-border flex items-center justify-between">
          <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Active Threat Feed
          </span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-[10px] font-bold text-destructive uppercase">Live Monitoring</span>
          </div>
        </div>

        <div className="divide-y divide-border">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <ShieldAlert className="w-12 h-12 text-muted-foreground/20 mb-3" />
              <p className="text-muted-foreground text-sm">No real threats detected in the registry.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                    <ShieldAlert className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      {alert.file_name}
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20 uppercase font-black">
                        Critical
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Threat Score: {alert.threat_score}% • Detected {getTimeAgo(alert.timestamp)}
                    </div>
                  </div>
                </div>
                <button className="text-xs font-bold text-primary hover:underline px-4 py-2">
                  INVESTIGATE
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
