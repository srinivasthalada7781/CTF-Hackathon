import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { User, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ThreatScoreGaugeProps {
  score: number;
  prediction: string;
  confidence: number;
  malwareFamily?: string;
}

const ThreatScoreGauge = ({ score, prediction, confidence, malwareFamily }: ThreatScoreGaugeProps) => {
  const strokeDasharray = 2 * Math.PI * 110;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * score) / 100;

  const getLevelColor = () => {
    if (score >= 70) return '#ef4444'; // Red
    if (score >= 40) return '#f59e0b'; // Amber
    return '#10b981'; // Emerald
  };

  const color = getLevelColor();

  const getAnalystRecommendation = (scoreValue: number) => {
    if (scoreValue >= 70) return "Malicious behavior detected. File blocked.";
    if (scoreValue >= 40) return "Suspicious indicators found. Proceed with caution.";
    return "No threats detected. File is safe.";
  };

  const recommendationText = getAnalystRecommendation(score);

  return (
    <div className="glass-card p-10 flex flex-col items-center text-center relative overflow-hidden group">
      <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
        <div className="human-badge relative z-0">
           <User className="w-3 h-3" />
           Threat Score
        </div>
        
          <Tooltip>
            <TooltipTrigger asChild>
               <Info className="w-4 h-4 text-slate-300 hover:text-blue-500 cursor-help transition-colors z-20 relative" />
            </TooltipTrigger>
            <TooltipContent side="bottom">
               <p>XGBoost ML probability × heuristic safeguard layer (entropy, API injection, anti-VM, surveillance). Score 0–100. Above 70 = malicious.</p>
            </TooltipContent>
          </Tooltip>
        
      </div>

      <div className="relative w-64 h-64 mb-10 mt-4">
        {/* Outer Glow Ring */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-10 transition-colors duration-1000"
          style={{ backgroundColor: color }}
        />
        
        <svg className="w-full h-full -rotate-90 drop-shadow-sm" viewBox="0 0 256 256">
          {/* Background Track */}
          <circle
            cx="128"
            cy="128"
            r="110"
            fill="none"
            stroke="#f8fafc"
            strokeWidth="12"
          />
          {/* Active Progress */}
          <motion.circle
            cx="128"
            cy="128"
            r="110"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: strokeDasharray }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Inner Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <span className="text-7xl font-black text-slate-900 tracking-tighter">
              {score}<span className="text-2xl text-slate-300">%</span>
            </span>
            <div className="mt-1">
              <span className={cn(
                 "text-[10px] font-black uppercase tracking-[3px] px-3 py-1 rounded-full",
                 score >= 70 ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
              )}>
                {score >= 70 ? "High Risk" : "Procedural Safe"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="space-y-4 max-w-xs relative z-10 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 w-full">
        <div className="flex flex-col items-center gap-1.5">
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AI Recommendation</span>
           <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic">
             "{recommendationText}"
           </p>
        </div>
        
        <div className="pt-3 border-t border-slate-200 flex items-center justify-center gap-3 w-full">
          <div className="flex flex-col items-center flex-1 min-w-0">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight truncate w-full">{malwareFamily || 'N/A'}</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Strain</span>
          </div>
          <div className="w-px h-6 bg-slate-200 shrink-0" />
          <div className="flex flex-col items-center flex-1">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{Math.round(confidence * 100)}%</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Confidence</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatScoreGauge;
