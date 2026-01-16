-- Migration: Add newsletter subscription field to profiles table
-- This migration adds the subscribed_to_newsletter field to track user newsletter preferences
-- and creates a table for managing unsubscribe tokens

-- Add subscribed_to_newsletter field to profiles table (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'subscribed_to_newsletter'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN subscribed_to_newsletter boolean DEFAULT true NOT NULL;
  END IF;
END $$;

-- Create index for faster newsletter subscription lookups
CREATE INDEX IF NOT EXISTS profiles_subscribed_to_newsletter_idx 
  ON public.profiles(subscribed_to_newsletter) 
  WHERE subscribed_to_newsletter = true;

-- Create unsubscribe tokens table for secure email unsubscription
CREATE TABLE IF NOT EXISTS public.newsletter_unsubscribe_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.newsletter_unsubscribe_tokens IS 'Stores secure tokens for one-click email unsubscription';
COMMENT ON COLUMN public.newsletter_unsubscribe_tokens.token IS 'Unique secure token for unsubscribe link';
COMMENT ON COLUMN public.newsletter_unsubscribe_tokens.used_at IS 'When the token was used (null if not used yet)';
COMMENT ON COLUMN public.newsletter_unsubscribe_tokens.expires_at IS 'Token expiration time (typically 90 days)';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_unsubscribe_token ON public.newsletter_unsubscribe_tokens(token);
CREATE INDEX IF NOT EXISTS idx_unsubscribe_user_id ON public.newsletter_unsubscribe_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_unsubscribe_email ON public.newsletter_unsubscribe_tokens(email);

-- Enable RLS
ALTER TABLE public.newsletter_unsubscribe_tokens ENABLE ROW LEVEL SECURITY;

-- Allow public to check tokens (for unsubscribe page)
CREATE POLICY "Allow public token verification" ON public.newsletter_unsubscribe_tokens
  FOR SELECT 
  USING (true);

-- Allow public to mark tokens as used
CREATE POLICY "Allow public token updates" ON public.newsletter_unsubscribe_tokens
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Function to generate unsubscribe token
CREATE OR REPLACE FUNCTION public.generate_unsubscribe_token(
  p_user_id UUID,
  p_email TEXT
) RETURNS TEXT AS $$
DECLARE
  v_token TEXT;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Generate random token (base64 of random bytes)
  v_token := encode(gen_random_bytes(32), 'base64');
  v_expires_at := NOW() + INTERVAL '90 days';
  
  -- Insert token
  INSERT INTO public.newsletter_unsubscribe_tokens (user_id, email, token, expires_at)
  VALUES (p_user_id, p_email, v_token, v_expires_at);
  
  RETURN v_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process unsubscribe
CREATE OR REPLACE FUNCTION public.process_unsubscribe(
  p_token TEXT
) RETURNS JSONB AS $$
DECLARE
  v_record RECORD;
  v_result JSONB;
BEGIN
  -- Find and validate token
  SELECT * INTO v_record
  FROM public.newsletter_unsubscribe_tokens
  WHERE token = p_token
    AND used_at IS NULL
    AND expires_at > NOW();
  
  IF v_record IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid or expired token'
    );
  END IF;
  
  -- Mark token as used
  UPDATE public.newsletter_unsubscribe_tokens
  SET used_at = NOW()
  WHERE id = v_record.id;
  
  -- Update profile (if user_id exists)
  IF v_record.user_id IS NOT NULL THEN
    UPDATE public.profiles
    SET subscribed_to_newsletter = false
    WHERE id = v_record.user_id;
  END IF;
  
  -- Update newsletter_subscribers table (if email exists there)
  UPDATE public.newsletter_subscribers
  SET status = 'unsubscribed',
      updated_at = NOW()
  WHERE email = v_record.email;
  
  RETURN jsonb_build_object(
    'success', true,
    'email', v_record.email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.generate_unsubscribe_token(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_unsubscribe(TEXT) TO anon, authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Newsletter subscription field and unsubscribe system created successfully!';
END $$;
