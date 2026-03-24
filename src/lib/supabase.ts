import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zukwpsxfqczdaqxthrxp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1a3dwc3hmcWN6ZGFxeHRocnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjgyMjksImV4cCI6MjA4OTk0NDIyOX0.79VZ0PIU151Hnrui_L6uG__5knkH6WM-hZIzZPLmgJU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
