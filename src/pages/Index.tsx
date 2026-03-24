import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "sonner";
import { User, Activity, FileSearch, ShieldCheck, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import DashboardSidebar, { NavPage } from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import FileUploadZone from '@/components/FileUploadZone';
import ThreatScoreGauge from '@/components/ThreatScoreGauge';
import VTReputationCard from '@/components/VTReputationCard';
import PEAnalysis from '@/components/PEAnalysis';
import ShapExplainability from '@/components/ShapExplainability';
import AIAnalystReport from '@/components/AIAnalystReport';
import ScanHistory from '@/components/ScanHistory';
import AlertsFeed from '@/components/AlertsFeed';
import ModelIntelligenceLab from '@/components/ModelIntelligenceLab';
import type { ScanResult } from '@/lib/mock-data';

const Index = () => {
  const [activePage, setActivePage] = useState<NavPage>('scanner');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const exportPDF = async () => {
    const input = document.getElementById('report-container');
    if (!input) return;
    
    setIsExporting(true);
    toast.info("Generating PDF Executive Report...");
    
    try {
      const canvas = await html2canvas(input, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#f8fafc' 
      });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`S3_Scan_Report_${scanResult?.id?.slice(0, 8) || '0000'}.pdf`);
      toast.success("Report Saved Successfully");
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF document.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    setScanResult(null);

    try {
      // Professional analysis delay
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/scan', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Scan node communication failure');
      
      const result = await response.json();
      setScanResult(result);
      
      toast.success("Investigation Report Ready", {
        description: "Case file has been compiled with human-validated markers.",
      });
    } catch (error) {
      console.error('Scan error:', error);
      toast.error("Analysis Link Interrupted", {
        description: "Unable to reach the backend audit engine."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderContent = () => {
    if (activePage === 'history') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col text-left">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Scan History</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mt-1">Previous Malware Scans</p>
          </div>
          <div className="h-[600px]">
            <ScanHistory onSelectScan={(scan) => {
              setScanResult(scan);
              setActivePage('scanner');
            }} />
          </div>
        </div>
      );
    }

    if (activePage === 'alerts') {
       return (
        <div className="space-y-6">
          <div className="flex flex-col text-left">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">High-Threat Escalations</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mt-1">Real-time Global Vector Monitoring</p>
          </div>
          <div className="h-[600px]">
            <AlertsFeed />
          </div>
        </div>
      );
    }

    if (activePage === 'intelligence') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col text-left mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Model Evaluation</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mt-1">AI Performance Metrics — Live Data</p>
          </div>
          <ModelIntelligenceLab />
        </div>
      );
    }

    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        {!scanResult ? (
          <div className="max-w-4xl mx-auto py-12">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 mb-4">
                 <ShieldCheck className="w-3.5 h-3.5" />
                 <span className="text-[10px] font-black uppercase tracking-widest">AI Protection Active</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                S³ <span className="text-blue-600">Malware</span> Scanner
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[3px]">
                Machine Learning Powered Threat Detection
              </p>
            </div>
            <FileUploadZone onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
          </div>
        ) : (
          <motion.div
            id="report-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 p-4 bg-slate-50/50 rounded-[2rem]"
          >
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 pb-6 border-b border-slate-200">
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[2px] border border-emerald-200 flex items-center gap-1.5">
                     <ShieldCheck className="w-3 h-3" />
                     Scan Complete
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[2px] border border-slate-200">
                     ID: {scanResult.id?.slice(0, 8) || 'LIVE'}
                  </div>
                  {scanResult.threatScore >= 70 && (
                    <div className="px-3 py-1 rounded-lg bg-red-600 text-white text-[10px] font-black uppercase tracking-[2px] animate-pulse flex items-center gap-1">
                       <Activity className="w-3 h-3" /> Threat Detected
                    </div>
                  )}
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                  {scanResult.fileName}
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <p className="data-mono text-[10px] text-slate-400 uppercase tracking-widest">
                    Scan Ref: {scanResult.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={exportPDF}
                  disabled={isExporting}
                  className="px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {isExporting ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  {isExporting ? 'Exporting...' : 'Export PDF'}
                </button>
                <button 
                  onClick={() => setScanResult(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:border-slate-300 hover:text-slate-700 transition-all shadow-sm flex items-center gap-2"
                >
                  <FileSearch className="w-3.5 h-3.5" />
                  Scan New File
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 h-full">
                <ThreatScoreGauge 
                  score={scanResult.threatScore} 
                  prediction={scanResult.prediction}
                  confidence={scanResult.confidence}
                  malwareFamily={scanResult.malwareFamily}
                />
              </div>
              <div className="lg:col-span-2 h-full">
                 <AIAnalystReport scanResult={scanResult} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              <div className="lg:col-span-2">
                <ShapExplainability explanations={scanResult.explanations || []} />
              </div>
              <div className="lg:col-span-1 flex flex-col gap-8">
                <div className="shrink-0">
                  <VTReputationCard data={scanResult.virusTotal || { malicious: 0, suspicious: 0, undetected: 0, harmless: 0, total_engines: 0 }} />
                </div>
                <div className="flex-1 min-h-[300px]">
                  <AlertsFeed />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <PEAnalysis result={scanResult} />
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <DashboardSidebar activePage={activePage} onNavigate={setActivePage} />
      
      <main className="pl-16 md:pl-64 transition-all duration-500 min-h-screen relative overflow-hidden">
        {/* Abstract Background Detail */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/20 rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-50 opacity-50 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />
        
        <DashboardHeader />
        
        <div className="p-8 md:p-12 relative z-10 animate-in fade-in duration-1000">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
