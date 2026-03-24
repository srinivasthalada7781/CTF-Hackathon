import { BrainCircuit, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ShapExplainabilityProps {
  explanations: any[];
}

const ShapExplainability = ({ explanations }: ShapExplainabilityProps) => {
  return (
    <div className="glass-card p-6 md:p-8 w-full h-full relative group overflow-hidden border border-slate-200 flex flex-col">
      {/* High-Tech Dot Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.15] pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10 shrink-0">
        <div className="flex items-center gap-3 shrink-0 min-w-0">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
            <BrainCircuit className="w-5 h-5 text-blue-600 shrink-0" />
          </div>
          <h3 className="label-caps !text-slate-900 !text-[12px] tracking-[4px] truncate">Model Logic Breakdown</h3>
          
            <Tooltip>
              <TooltipTrigger asChild>
                 <Info className="w-4 h-4 text-slate-400 hover:text-blue-600 cursor-help transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-white border-slate-200 shadow-xl">
                 <p className="w-64 text-[11px] font-bold text-slate-600 leading-relaxed">Displays SHAP (SHapley Additive exPlanations) values. Shows you exactly which mathematical features the ML model weighed to calculate its final decision.</p>
              </TooltipContent>
            </Tooltip>
          
        </div>
        <div className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none shrink-0 shadow-sm self-start sm:self-auto">
          SHAP Neural Inference
        </div>
      </div>

      <div className="h-[300px] w-full mt-4 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={explanations}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            barSize={18}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="feature"
              type="category"
              axisLine={false}
              tickLine={false}
              width={140}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
            />
            <RechartsTooltip
              cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '900',
                textTransform: 'uppercase',
                color: '#fff',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{ color: '#60a5fa' }}
            />
            <Bar
              dataKey="impact"
              radius={[0, 4, 4, 0]}
              animationDuration={1500}
            >
              {explanations.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.direction === 'positive' ? '#ef4444' : '#3b82f6'}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 pt-6 border-t border-slate-200 relative z-10 shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse" />
          <div className="text-left">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest block">Malicious Vector</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Increasing probability</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" />
          <div className="text-left">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest block">Benign Indicator</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Decreasing probability</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapExplainability;
