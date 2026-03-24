import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type ScanResult } from '@/lib/mock-data';
import { supabase } from '@/lib/supabase';
import ThreatScoreGauge from '@/components/ThreatScoreGauge';
import ShapExplainability from '@/components/ShapExplainability';
import PEAnalysis from '@/components/PEAnalysis';
import { History, Search, Loader2 } from 'lucide-react';

const HistoryPage = () => {
  const [filter, setFilter] = useState<'all' | 'malicious' | 'benign'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ScanResult | null>(null);
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedScans: ScanResult[] = data.map((row: any) => {
          // If result_json exists, use it. Otherwise, fallback to basic row data.
          if (row.result_json) {
            return {
              ...row.result_json,
              id: row.id,
              timestamp: row.timestamp
            };
          }
          return {
            id: row.id,
            fileName: row.file_name,
            fileSize: 'N/A',
            prediction: row.prediction.toLowerCase().includes('benign') ? 'benign' : 'malicious',
            confidence: row.confidence,
            threatScore: row.threat_score,
            timestamp: row.timestamp,
            features: { entropy: 0, suspiciousImports: [], sections: 0, entryPoint: '0x0' },
            explanations: [],
            peAnalysis: []
          };
        });
        setScans(formattedScans);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = scans.filter(s => {
    const matchFilter = filter === 'all' ? true : s.prediction === filter;
    const matchSearch = s.fileName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 max-w-[1720px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Scan History</h1>
        </div>
        <button 
          onClick={fetchHistory}
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: history table */}
        <div className="lg:col-span-5 card-surface p-5">
          {/* Controls */}
          <div className="flex flex-col gap-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search file name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-md bg-muted text-sm text-foreground outline-none border border-border focus:border-primary transition-colors"
              />
            </div>
            <div className="flex gap-1">
              {(['all', 'malicious', 'benign'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'flex-1 text-[10px] font-mono font-bold uppercase py-1.5 rounded-sm transition-colors',
                    filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No real scans found yet.</p>
            ) : (
              filtered.map(scan => (
                <button
                  key={scan.id}
                  onClick={() => setSelected(scan)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-md transition-colors text-left',
                    selected?.id === scan.id ? 'bg-muted border border-primary/30' : 'hover:bg-muted'
                  )}
                >
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0', scan.prediction === 'malicious' ? 'bg-destructive' : 'bg-primary')} />
                  <div className="flex-1 min-w-0">
                    <div className="data-mono text-sm text-foreground truncate">{scan.fileName}</div>
                    <div className="text-xs text-muted-foreground">{new Date(scan.timestamp).toLocaleString()}</div>
                  </div>
                  <div className={cn('data-mono text-sm font-bold flex-shrink-0',
                    scan.threatScore >= 70 ? 'text-destructive' : scan.threatScore >= 40 ? 'text-warning' : 'text-primary'
                  )}>{scan.threatScore}</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: detail view */}
        <div className="lg:col-span-7">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                <div className="md:col-span-2">
                  <ThreatScoreGauge 
                    score={selected.threatScore} 
                    prediction={selected.prediction} 
                    confidence={selected.confidence} 
                    malwareFamily={selected.malwareFamily}
                  />
                </div>
                <div className="md:col-span-3">
                  <ShapExplainability explanations={selected.explanations} />
                </div>
              </div>
              <PEAnalysis result={selected} />
            </motion.div>
          ) : (
            <div className="card-surface h-full min-h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Select a real scan entry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
