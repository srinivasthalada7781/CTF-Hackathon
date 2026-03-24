export interface ScanResult {
  id: string;
  fileName: string;
  fileSize: string;
  prediction: 'malicious' | 'benign';
  malwareFamily?: string;
  confidence: number;
  threatScore: number;
  timestamp: string;
  features: {
    entropy: number;
    suspiciousImports: string[];
    sections: number;
    imphash?: string;
    isSigned?: boolean;
    entryPoint: string;
  };
  explanations: {
    feature: string;
    impact: number;
    direction: 'positive' | 'negative';
  }[];
  peAnalysis: {
    name: string;
    vSize: string;
    rSize: string;
    entropy: number;
  }[];
  virusTotal?: {
    malicious: number;
    suspicious: number;
    undetected: number;
    harmless: number;
    total_engines: number;
  };
}

// REMOVED ALL MOCK DATA ENTRIES
// The system now fetches 100% real data from Supabase.
export const mockScanHistory: ScanResult[] = [];

export const mockAlerts = [];
