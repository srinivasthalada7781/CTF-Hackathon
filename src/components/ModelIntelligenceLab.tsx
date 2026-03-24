import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BrainCircuit, Activity, Target, ShieldCheck, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const CLASS_COLORS: Record<string, string> = {
  Benign:     '#10b981',
  Trojan:     '#ef4444',
  Ransomware: '#f59e0b',
  Spyware:    '#8b5cf6',
  Downloader: '#3b82f6',
};

const ModelIntelligenceLab = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/metrics')
      .then(r => { if (!r.ok) throw new Error('Metrics not available'); return r.json(); })
      .then(data => setMetrics(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Activity className="w-8 h-8 text-blue-400 animate-spin" />
    </div>
  );

  if (error || !metrics) return (
    <div className="glass-card p-8 text-center text-slate-400">
      <p className="font-bold text-sm">Could not load metrics. Make sure the backend is running.</p>
    </div>
  );

  const classNames: string[] = metrics.class_names || [];
  const report = metrics.report || {};
  const confusionMatrix: number[][] = metrics.confusion_matrix || [];

  // Per-class bar chart data
  const barData = classNames.map((cls: string) => ({
    name: cls,
    precision: Math.round((report[cls]?.precision || 0) * 100),
    recall:    Math.round((report[cls]?.recall    || 0) * 100),
    f1:        Math.round((report[cls]?.['f1-score'] || 0) * 100),
    color: CLASS_COLORS[cls] || '#64748b',
  }));

  // Overall accuracy
  const accuracy = Math.round((metrics.accuracy || 0) * 100);

  // Confusion matrix max for heat intensity
  const flatMatrix = confusionMatrix.flat();
  const maxVal = Math.max(...flatMatrix, 1);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl">
          <p className="text-[11px] font-black text-white uppercase tracking-widest mb-2">{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ color: p.fill }} className="text-[11px] font-bold">
              {p.name}: {p.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Accuracy KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Accuracy', value: `${accuracy}%`, icon: Target, color: 'blue',
            tip: 'The percentage of all files the model classified correctly across all 5 malware families in the held-out test set.' },
          { label: 'Macro Precision', value: `${Math.round((report['macro avg']?.precision||0)*100)}%`, icon: ShieldCheck, color: 'emerald',
            tip: 'Average precision across all 5 classes. Precision = True Positives / (True Positives + False Positives). High precision = fewer safe files wrongly flagged.' },
          { label: 'Macro Recall', value: `${Math.round((report['macro avg']?.recall||0)*100)}%`, icon: BrainCircuit, color: 'violet',
            tip: 'Average recall across all 5 classes. Recall = True Positives / (True Positives + False Negatives). High recall = fewer real threats missed.' },
          { label: 'Macro F1 Score', value: `${Math.round((report['macro avg']?.['f1-score']||0)*100)}%`, icon: Activity, color: 'amber',
            tip: 'Harmonic mean of Precision and Recall. The balanced score that penalizes both false positives and false negatives equally.' },
        ].map(({ label, value, icon: Icon, color, tip }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <div className={cn(
                "glass-card p-5 border relative overflow-hidden cursor-help",
                color === 'blue'    && 'border-blue-100',
                color === 'emerald' && 'border-emerald-100',
                color === 'violet'  && 'border-violet-100',
                color === 'amber'   && 'border-amber-100',
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center mb-3",
                  color === 'blue'    && 'bg-blue-50',
                  color === 'emerald' && 'bg-emerald-50',
                  color === 'violet'  && 'bg-violet-50',
                  color === 'amber'   && 'bg-amber-50',
                )}>
                  <Icon className={cn(
                    "w-4 h-4",
                    color === 'blue'    && 'text-blue-600',
                    color === 'emerald' && 'text-emerald-600',
                    color === 'violet'  && 'text-violet-600',
                    color === 'amber'   && 'text-amber-600',
                  )} />
                </div>
                <p className="text-2xl font-black text-slate-900">{value}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top"><p>{tip}</p></TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Per-Class Bar Chart */}
      <div className="glass-card p-6 md:p-8 border border-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.08] pointer-events-none" />
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
            <BrainCircuit className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="label-caps !text-slate-900 !text-[12px] tracking-[4px]">Per-Class Performance Metrics</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-slate-300 hover:text-blue-500 cursor-help transition-colors" />
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Each bar group shows how well the model classified one malware family. Hover individual bars to see exact scores. Benign (green) should have high precision to prevent false alarms.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4 relative z-10">
          {[
            { key: 'precision', color: '#3b82f6', label: 'Precision' },
            { key: 'recall',    color: '#10b981', label: 'Recall' },
            { key: 'f1',        color: '#8b5cf6', label: 'F1 Score' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>
        <div className="h-64 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="precision" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={20} />
              <Bar dataKey="recall"    fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={20} />
              <Bar dataKey="f1"        fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Confusion Matrix */}
      <div className="glass-card p-6 md:p-8 border border-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#3b82f615_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="p-2 rounded-xl bg-violet-50 border border-violet-100">
            <Target className="w-5 h-5 text-violet-600" />
          </div>
          <h3 className="label-caps !text-slate-900 !text-[12px] tracking-[4px]">Confusion Matrix</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-slate-300 hover:text-violet-500 cursor-help transition-colors" />
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Rows = actual class, columns = predicted class. The green diagonal shows correct classifications. Red off-diagonal cells show misclassifications between malware families.</p>
            </TooltipContent>
          </Tooltip>
          <span className="text-[10px] font-black text-slate-400 ml-auto">Darker = More Predictions</span>
        </div>
        <div className="relative z-10 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Actual ↓ / Pred →</th>
                {classNames.map((cls: string) => (
                  <th key={cls} className="p-2 text-[9px] font-black uppercase tracking-wide text-center" style={{ color: CLASS_COLORS[cls] }}>
                    {cls}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {confusionMatrix.map((row: number[], i: number) => (
                <tr key={i}>
                  <td className="p-2 text-[9px] font-black uppercase tracking-wide whitespace-nowrap" style={{ color: CLASS_COLORS[classNames[i]] }}>
                    {classNames[i]}
                  </td>
                  {row.map((val: number, j: number) => {
                    const intensity = val / maxVal;
                    const isDiag = i === j;
                    return (
                      <td key={j} className="p-1 text-center">
                        <div
                          className={cn(
                            "w-full h-12 min-w-[48px] rounded-lg flex items-center justify-center font-black text-[13px] transition-all",
                            isDiag ? 'ring-2 ring-emerald-400 ring-offset-1' : ''
                          )}
                          style={{
                            backgroundColor: isDiag
                              ? `rgba(16, 185, 129, ${0.15 + intensity * 0.7})`
                              : `rgba(239, 68, 68, ${intensity * 0.5})`,
                            color: isDiag ? '#065f46' : intensity > 0.3 ? '#7f1d1d' : '#94a3b8',
                          }}
                        >
                          {val}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4 relative z-10">
          ✅ Green diagonal = Correct predictions · 🔴 Red off-diagonal = Classification errors
        </p>
      </div>
    </div>
  );
};

export default ModelIntelligenceLab;
