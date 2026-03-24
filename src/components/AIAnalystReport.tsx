import { useState } from 'react';
import { Bot, Sparkles, Activity, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface AIAnalystReportProps {
  scanResult: any;
}

const AIAnalystReport = ({ scanResult }: AIAnalystReportProps) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scanResult),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Generation failed');
      
      setReport(data.report);
      toast.success("AI Intel Report Generated");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to generate AI report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative p-[1px] rounded-[2rem] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 w-full group overflow-hidden shadow-2xl shadow-blue-500/10">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 blur-xl opacity-30 animate-pulse-slow"></div>
      
      <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] w-full relative z-10 flex flex-col h-full overflow-hidden">
        {/* Abstract Dark AI Background Detail */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-20">
          <div className="flex items-center gap-3 shrink-0 min-w-0">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Bot className="w-5 h-5 text-blue-400 shrink-0" />
            </div>
            <h3 className="label-caps !text-white !text-[12px] tracking-[4px] truncate drop-shadow-md">GenAI Threat Intelligence</h3>
            
              <Tooltip>
                <TooltipTrigger asChild>
                   <Info className="w-4 h-4 text-blue-400/50 hover:text-blue-400 cursor-help transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-slate-800 border-slate-700">
                   <p className="w-56 text-[11px] font-bold text-slate-300">Powered by our custom multi-LLM router. Synthesizes heuristic reports on-the-fly using 21+ high-availability models across Groq, OpenRouter, and Gemini.</p>
                </TooltipContent>
              </Tooltip>
            
          </div>
        {!report && !loading && (
          <button 
            onClick={generateReport}
            className="px-4 py-2 rounded-xl bg-blue-500 text-white font-black text-[10px] uppercase tracking-[2px] hover:bg-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all flex items-center gap-2 relative z-20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate Analyst Summary
          </button>
        )}
      </div>

      <div className="relative z-20 grow flex flex-col justify-center">
        {loading ? (
          <div className="min-h-[150px] flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <Activity className="w-8 h-8 text-blue-400 animate-spin" />
              <div className="absolute inset-0 bg-blue-400 blur-md opacity-50 animate-pulse"></div>
            </div>
            <span className="text-[10px] font-black text-blue-400/80 uppercase tracking-[3px] animate-pulse">Consulting LLM Neural Engine...</span>
          </div>
        ) : report ? (
          <div className="prose prose-sm max-w-none text-slate-300 space-y-5 data-mono text-[12px] leading-relaxed bg-slate-950/50 p-6 rounded-2xl border border-slate-800 shadow-inner h-full">
             {report.split('\n\n').map((paragraph, idx) => {
               // Highlight the bracketed headers
               const Parts = paragraph.split(']:');
               if (Parts.length > 1) {
                 return (
                   <p key={idx} className="whitespace-pre-wrap m-0">
                      <strong className="text-blue-400 font-black tracking-wider">{Parts[0]}:</strong>{Parts[1]}
                   </p>
                 )
               }
               return (
                 <p key={idx} className="whitespace-pre-wrap m-0">
                    {paragraph}
                 </p>
               )
             })}
          </div>
        ) : (
          <div className="min-h-[150px] flex items-center justify-center border border-dashed border-slate-700 rounded-2xl bg-slate-800/20 backdrop-blur-sm h-full">
             <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[3px] text-center px-6 leading-loose">
               Execute DeepMind LLM integration to synthesize<br/>raw heuristics into actionable SOC intel.
             </span>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default AIAnalystReport;
