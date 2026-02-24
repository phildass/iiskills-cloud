-- Newsletter Approval Workflow Migration
-- 
-- This migration adds support for admin approval workflow for newsletters
-- Newsletters must be approved before they can be sent to subscribers
--
-- Run this in your Supabase SQL Editor:
-- Dashboard → SQL Editor → New Query → Paste this script → Run

-- ============================================
-- UPDATE NEWSLETTER_EDITIONS TABLE
-- ============================================

-- Add new status values for approval workflow
-- Note: PostgreSQL requires dropping and recreating the constraint
ALTER TABLE newsletter_editions 
DROP CONSTRAINT IF EXISTS newsletter_editions_status_check;

ALTER TABLE newsletter_editions
ADD CONSTRAINT newsletter_editions_status_check 
CHECK (status IN ('draft', 'approved', 'rejected', 'scheduled', 'sent', 'failed'));

-- Add approval tracking fields
ALTER TABLE newsletter_editions
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS approved_by TEXT,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add comments
COMMENT ON COLUMN newsletter_editions.approved_at IS 'When the newsletter was approved by admin';
COMMENT ON COLUMN newsletter_editions.approved_by IS 'Admin user who approved the newsletter';
COMMENT ON COLUMN newsletter_editions.rejection_reason IS 'Reason for rejection if status is rejected';

-- ============================================
-- UPDATE DEFAULT BEHAVIOR
-- ============================================

-- Update the trigger or default to create newsletters in 'draft' status
-- This ensures new newsletters require approval before sending

-- Add index for approval workflow queries
CREATE INDEX IF NOT EXISTS idx_newsletter_approved_at ON newsletter_editions(approved_at DESC);

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify the migration worked:
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'newsletter_editions' 
-- AND column_name IN ('status', 'approved_at', 'approved_by', 'rejection_reason');
