-- Newsletter Subscribers Table Migration
-- 
-- This migration creates the newsletter_subscribers table for storing
-- email subscriptions across all iiskills.cloud domains and subdomains.
--
-- Run this in your Supabase SQL Editor:
-- Dashboard → SQL Editor → New Query → Paste this script → Run

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment to table
COMMENT ON TABLE newsletter_subscribers IS 'Stores newsletter subscription data from all iiskills.cloud domains and subdomains';

-- Add comments to columns
COMMENT ON COLUMN newsletter_subscribers.email IS 'Subscriber email address (unique)';
COMMENT ON COLUMN newsletter_subscribers.subscribed_at IS 'When the user subscribed';
COMMENT ON COLUMN newsletter_subscribers.source IS 'Domain/subdomain where subscription originated';
COMMENT ON COLUMN newsletter_subscribers.status IS 'Subscription status: active, unsubscribed, or bounced';

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);

-- Create index for source analytics
CREATE INDEX IF NOT EXISTS idx_newsletter_source ON newsletter_subscribers(source);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running migration)
DROP POLICY IF EXISTS "Allow public inserts" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public reads" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public updates" ON newsletter_subscribers;

-- Policy to allow anyone to subscribe (INSERT)
CREATE POLICY "Allow public inserts" ON newsletter_subscribers
  FOR INSERT 
  WITH CHECK (true);

-- Policy to allow anyone to check if email exists (SELECT)
-- This is needed for duplicate detection in the API
CREATE POLICY "Allow public reads" ON newsletter_subscribers
  FOR SELECT 
  USING (true);

-- Policy to allow users to unsubscribe (UPDATE)
-- In future, this could be restricted to only update status field
CREATE POLICY "Allow public updates" ON newsletter_subscribers
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_newsletter_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_newsletter_subscribers_updated_at ON newsletter_subscribers;
CREATE TRIGGER update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_updated_at();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Newsletter subscribers table created successfully!';
  RAISE NOTICE 'You can now start collecting newsletter subscriptions.';
END $$;
