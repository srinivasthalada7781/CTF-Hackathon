import { useState } from 'react';
import { Upload, Activity, ShieldCheck, Cpu, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

const FileUploadZone = ({ onFileSelect, isAnalyzing }: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div 
      className={cn(
        "relative group transition-all duration-500",
        isAnalyzing ? "pointer-events-none opacity-80" : ""
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={cn(
        "relative overflow-hidden rounded-[2rem] border-2 border-dashed transition-all duration-700",
        isDragging 
          ? "border-blue-500 bg-blue-50/50 scale-[0.99] shadow-inner" 
          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/50 shadow-sm"
      )}>
        {/* Progress scanline effect */}
        {isAnalyzing && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent z-10"
            initial={{ translateY: '-100%' }}
            animate={{ translateY: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        )}

        <div className="p-12 md:p-20 flex flex-col items-center justify-center text-center relative z-20">
          <div className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center mb-8 transition-all duration-700 shadow-lg",
            isAnalyzing 
              ? "bg-blue-600 animate-pulse shadow-blue-200" 
              : "bg-slate-900 shadow-slate-200 group-hover:scale-110 group-hover:bg-blue-600"
          )}>
            {isAnalyzing ? (
              <Activity className="w-10 h-10 text-white animate-spin-slow" />
            ) : (
              <Upload className="w-10 h-10 text-white group-hover:animate-bounce" />
            )}
          </div>

          <div className="space-y-4 max-w-sm mx-auto">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              {isAnalyzing ? "Analyzing File" : "File Upload"}
            </h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed uppercase tracking-wider">
              {isAnalyzing 
                ? "Scanning file against malware models..." 
                : "Drop suspicious files here or browse to scan"}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <label className={cn(
              "px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-[3px] transition-all cursor-pointer shadow-md",
              isAnalyzing
                ? "bg-slate-100 text-slate-400 border border-slate-200"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200"
            )}>
              {isAnalyzing ? "Processing..." : "Select File"}
              <input type="file" className="hidden" onChange={handleFileInput} disabled={isAnalyzing} />
            </label>
            
            <div className="px-6 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-400 font-black text-[10px] uppercase tracking-[3px] flex items-center gap-2 shadow-sm">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               Secure Scan Active
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:border-blue-200 group/item text-left">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover/item:bg-blue-600 transition-colors">
            <Cpu className="w-5 h-5 text-blue-600 group-hover/item:text-white" />
          </div>
          <div>
            <span className="block text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">AI Powered</span>
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Machine Learning Analysis</span>
          </div>
        </div>
        <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:border-blue-200 group/item text-left">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover/item:bg-blue-600 transition-colors">
            <Globe className="w-5 h-5 text-blue-600 group-hover/item:text-white" />
          </div>
          <div>
            <span className="block text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Global Intelligence</span>
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">VirusTotal Integration</span>
          </div>
        </div>
        <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:border-blue-200 group/item text-left">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover/item:bg-blue-600 transition-colors">
            <ShieldCheck className="w-5 h-5 text-blue-600 group-hover/item:text-white" />
          </div>
          <div>
            <span className="block text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Deep Inspection</span>
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">PE Feature Extraction</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadZone;
