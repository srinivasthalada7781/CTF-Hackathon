import { useState } from 'react';
import { Settings, Server, Bell, Shield, Key } from 'lucide-react';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
  const [apiUrl, setApiUrl] = useState('http://localhost:8000');
  const [notifications, setNotifications] = useState(true);
  const [autoScan, setAutoScan] = useState(false);
  const [threshold, setThreshold] = useState(70);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className="card-surface p-5 mb-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Icon className="w-4 h-4 text-primary" />
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );

  const Field = ({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <div className="text-sm text-foreground font-medium">{label}</div>
        {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
      </div>
      {children}
    </div>
  );

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={cn('relative w-10 h-5 rounded-full transition-colors', value ? 'bg-primary' : 'bg-muted border border-border')}
    >
      <span className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform', value ? 'translate-x-5' : 'translate-x-0.5')} />
    </button>
  );

  return (
    <div className="p-6 max-w-[800px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-5 h-5 text-muted-foreground" />
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
      </div>

      <Section title="API Configuration" icon={Server}>
        <Field label="Backend API URL" description="FastAPI malware detection server URL">
          <input
            value={apiUrl}
            onChange={e => setApiUrl(e.target.value)}
            className="w-64 px-3 py-1.5 rounded-md bg-muted text-sm text-foreground border border-border focus:border-primary outline-none"
          />
        </Field>
        <Field label="Alert Threat Threshold" description={`File flagged as alert when score ≥ ${threshold}`}>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={100}
              value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
              className="w-32 accent-primary"
            />
            <span className="text-sm font-mono font-bold text-foreground w-6">{threshold}</span>
          </div>
        </Field>
      </Section>

      <Section title="Supabase Integration" icon={Key}>
        <Field label="Supabase URL" description="Your Supabase project URL">
          <input
            value={supabaseUrl}
            onChange={e => setSupabaseUrl(e.target.value)}
            placeholder="https://xxx.supabase.co"
            className="w-64 px-3 py-1.5 rounded-md bg-muted text-sm text-foreground border border-border focus:border-primary outline-none"
          />
        </Field>
        <Field label="Supabase Anon Key" description="Your Supabase anonymous key">
          <input
            type="password"
            value={supabaseKey}
            onChange={e => setSupabaseKey(e.target.value)}
            placeholder="eyJhbGci..."
            className="w-64 px-3 py-1.5 rounded-md bg-muted text-sm text-foreground border border-border focus:border-primary outline-none"
          />
        </Field>
      </Section>

      <Section title="Detection Settings" icon={Shield}>
        <Field label="Auto-scan on upload" description="Automatically start scanning when file is dropped">
          <Toggle value={autoScan} onChange={setAutoScan} />
        </Field>
      </Section>

      <Section title="Notifications" icon={Bell}>
        <Field label="Enable Alerts" description="Show notifications for high threat detections">
          <Toggle value={notifications} onChange={setNotifications} />
        </Field>
      </Section>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={cn(
            'px-6 py-2 rounded-md text-sm font-semibold transition-colors',
            saved ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-primary text-primary-foreground hover:bg-primary/90'
          )}
        >
          {saved ? '✓ Saved' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
