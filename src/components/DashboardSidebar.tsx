import { cn } from "@/lib/utils";
import { Shield, Lock, Zap, User, Activity } from "lucide-react";
import { motion } from "framer-motion";

export type NavPage = 'scanner' | 'history' | 'alerts' | 'intelligence';

interface DashboardSidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
}

const menuItems: { id: NavPage; label: string; icon: any; description: string }[] = [
  { id: 'scanner', label: 'Scanner', icon: Shield, description: 'AI Malware Detection' },
  { id: 'history', label: 'History', icon: Lock, description: 'Previous Scans' },
  { id: 'alerts', label: 'Alerts', icon: Zap, description: 'Threat Monitoring' },
  { id: 'intelligence', label: 'Evaluation', icon: Activity, description: 'Model Metrics' },
];

export default function DashboardSidebar({ activePage, onNavigate }: DashboardSidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-16 md:w-64 bg-white border-r border-slate-100 z-50 transition-all duration-500 flex flex-col">
      <div className="p-8">
        <div className="flex items-center gap-3 group cursor-pointer">
          <img 
            src="/logo.png" 
            alt="S³ Logo" 
            className="w-10 h-10 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform object-cover"
          />
          <div className="hidden md:block">
            <p className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Secure Smart Scanner</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 group relative",
              activePage === item.id 
                ? "bg-blue-50 text-blue-600 shadow-sm" 
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform duration-500",
              activePage === item.id ? "scale-110" : "group-hover:scale-110"
            )} />
            
            <div className="hidden md:block text-left overflow-hidden">
              <span className="block text-xs font-black uppercase tracking-widest">{item.label}</span>
              <span className={cn(
                "block text-[9px] font-bold uppercase tracking-wider mt-0.5",
                activePage === item.id ? "text-blue-400" : "text-slate-300"
              )}>
                {item.description}
              </span>
            </div>

            {activePage === item.id && (
              <motion.div 
                layoutId="active-nav-indicator"
                className="absolute left-[-1rem] w-1.5 h-6 bg-blue-600 rounded-r-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </nav>

    </aside>
  );
}
