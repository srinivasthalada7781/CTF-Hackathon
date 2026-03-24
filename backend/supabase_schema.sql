-- Run this in your Supabase SQL Editor to create the history table

CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  prediction TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  threat_score INT NOT NULL,
  result_json JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Optional but recommended for security)
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all inserts (public for now)
CREATE POLICY "Enable insert for everyone" ON "public"."scans"
FOR INSERT WITH CHECK (true);

-- Create policy to allow anyone to read (public for now)
CREATE POLICY "Enable read for everyone" ON "public"."scans"
FOR SELECT USING (true);
