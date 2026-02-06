-- ============================================================================
-- Learn Govt Jobs - Database Schema
-- PostgreSQL DDL for geo-spatial queries, user tracking, job caching, and AI scoring
-- ============================================================================

-- Enable PostGIS extension for geo-spatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================================
-- GEOGRAPHY TABLES (India Administrative Units)
-- ============================================================================

-- States table
CREATE TABLE states (
    state_id SERIAL PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL UNIQUE,
    state_code VARCHAR(2) NOT NULL UNIQUE, -- ISO 3166-2:IN codes
    region VARCHAR(50), -- North, South, East, West, Central, Northeast
    capital VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_states_name ON states(state_name);
CREATE INDEX idx_states_region ON states(region);

-- Districts table
CREATE TABLE districts (
    district_id SERIAL PRIMARY KEY,
    district_name VARCHAR(100) NOT NULL,
    state_id INTEGER NOT NULL REFERENCES states(state_id) ON DELETE CASCADE,
    district_code VARCHAR(10),
    headquarters VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(district_name, state_id)
);

-- Create indexes for faster lookups
CREATE INDEX idx_districts_state ON districts(state_id);
CREATE INDEX idx_districts_name ON districts(district_name);

-- Taluks/Tehsils/Blocks table (sub-district administrative units)
CREATE TABLE taluks (
    taluk_id SERIAL PRIMARY KEY,
    taluk_name VARCHAR(100) NOT NULL,
    district_id INTEGER NOT NULL REFERENCES districts(district_id) ON DELETE CASCADE,
    taluk_code VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(taluk_name, district_id)
);

-- Create indexes for faster lookups
CREATE INDEX idx_taluks_district ON taluks(district_id);
CREATE INDEX idx_taluks_name ON taluks(taluk_name);

-- ============================================================================
-- USER TABLES
-- ============================================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    user_id UUID PRIMARY KEY, -- References auth.users in Supabase
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(15),
    full_name VARCHAR(200),
    
    -- Geographic preferences
    preferred_state_id INTEGER REFERENCES states(state_id),
    preferred_district_id INTEGER REFERENCES districts(district_id),
    preferred_taluk_id INTEGER REFERENCES taluks(taluk_id),
    
    -- User profile for job matching
    date_of_birth DATE,
    gender VARCHAR(20),
    category VARCHAR(20), -- General, OBC, SC, ST, EWS
    pwd BOOLEAN DEFAULT FALSE, -- Person with Disability
    ex_serviceman BOOLEAN DEFAULT FALSE,
    
    -- Subscription status
    subscription_status VARCHAR(20) DEFAULT 'free', -- free, trial, paid
    subscription_start DATE,
    subscription_end DATE,
    
    -- WhatsApp opt-in for notifications
    whatsapp_optin BOOLEAN DEFAULT FALSE,
    whatsapp_number VARCHAR(15),
    
    -- Preferences
    language_preference VARCHAR(10) DEFAULT 'en', -- en, hi, ta, te, etc.
    notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "whatsapp": false, "push": false}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_state ON users(preferred_state_id);
CREATE INDEX idx_users_district ON users(preferred_district_id);
CREATE INDEX idx_users_subscription ON users(subscription_status);

-- User qualifications table
CREATE TABLE user_qualifications (
    qualification_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    degree VARCHAR(100) NOT NULL, -- 10th, 12th, Graduate, Post-Graduate, PhD
    field_of_study VARCHAR(200),
    university VARCHAR(200),
    year_of_completion INTEGER,
    percentage DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_qualifications_user ON user_qualifications(user_id);

-- User experience table
CREATE TABLE user_experience (
    experience_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    job_title VARCHAR(200),
    organization VARCHAR(200),
    sector VARCHAR(100), -- Government, Private, PSU
    years_of_experience DECIMAL(3,1),
    is_current BOOLEAN DEFAULT FALSE,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_experience_user ON user_experience(user_id);

-- ============================================================================
-- JOB TABLES
-- ============================================================================

-- Job categories
CREATE TABLE job_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    parent_category_id INTEGER REFERENCES job_categories(category_id),
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_job_categories_parent ON job_categories(parent_category_id);

-- Jobs table (cached government job notifications)
CREATE TABLE jobs (
    job_id SERIAL PRIMARY KEY,
    
    -- Basic information
    title VARCHAR(500) NOT NULL,
    organization VARCHAR(200) NOT NULL,
    department VARCHAR(200),
    category_id INTEGER REFERENCES job_categories(category_id),
    
    -- Job details
    post_name VARCHAR(300),
    total_vacancies INTEGER,
    vacancies JSONB, -- Detailed breakdown: {"General": 50, "OBC": 30, "SC": 15, "ST": 5}
    
    -- Geographic scope
    job_type VARCHAR(20), -- Central, State, PSU, Local
    state_id INTEGER REFERENCES states(state_id),
    district_ids INTEGER[], -- Array of district IDs for multi-district jobs
    
    -- Eligibility
    min_age INTEGER,
    max_age INTEGER,
    age_relaxation JSONB, -- {"OBC": 3, "SC": 5, "ST": 5, "PWD": 10}
    
    min_qualification VARCHAR(100),
    required_qualifications JSONB, -- Array of qualification details
    
    experience_required BOOLEAN DEFAULT FALSE,
    min_experience_years DECIMAL(3,1),
    
    -- Application details
    application_fee DECIMAL(10,2),
    fee_exemptions JSONB, -- {"SC": true, "ST": true, "Female": true}
    
    application_mode VARCHAR(20), -- Online, Offline, Both
    application_start_date DATE,
    application_end_date DATE,
    exam_date DATE,
    result_date DATE,
    
    -- Document requirements
    required_documents JSONB, -- ["Photo", "Signature", "ID Proof", "Education Certificate"]
    
    -- Scraping metadata
    source_url TEXT NOT NULL,
    source_domain VARCHAR(200),
    pdf_url TEXT,
    notification_number VARCHAR(100),
    
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE,
    
    -- AI processing
    ai_processed BOOLEAN DEFAULT FALSE,
    ai_summary TEXT, -- LLM-generated summary
    ai_tags JSONB, -- Tags extracted by AI
    
    -- Content in multiple languages
    language VARCHAR(10) DEFAULT 'en',
    multilingual_content JSONB, -- {"hi": {...}, "ta": {...}}
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- active, expired, cancelled, filled
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for jobs table
CREATE INDEX idx_jobs_organization ON jobs(organization);
CREATE INDEX idx_jobs_category ON jobs(category_id);
CREATE INDEX idx_jobs_state ON jobs(state_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_dates ON jobs(application_end_date);
CREATE INDEX idx_jobs_type ON jobs(job_type);
CREATE INDEX idx_jobs_scraped ON jobs(scraped_at DESC);

-- GIN index for JSONB fields (for faster filtering)
CREATE INDEX idx_jobs_vacancies ON jobs USING GIN(vacancies);
CREATE INDEX idx_jobs_ai_tags ON jobs USING GIN(ai_tags);
CREATE INDEX idx_jobs_required_qualifications ON jobs USING GIN(required_qualifications);

-- Full-text search index
CREATE INDEX idx_jobs_search ON jobs USING GIN(
    to_tsvector('english', 
        COALESCE(title, '') || ' ' || 
        COALESCE(organization, '') || ' ' || 
        COALESCE(post_name, '')
    )
);

-- ============================================================================
-- AI MATCH SCORING TABLES
-- ============================================================================

-- Job match scores for users
CREATE TABLE job_match_scores (
    match_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    job_id INTEGER NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
    
    -- Overall match score (0-100)
    match_score DECIMAL(5,2) NOT NULL,
    
    -- Component scores
    location_score DECIMAL(5,2), -- How well job location matches user preference
    qualification_score DECIMAL(5,2), -- How well user qualifications match job requirements
    experience_score DECIMAL(5,2), -- Experience match
    eligibility_score DECIMAL(5,2), -- Age, category, etc.
    
    -- AI reasoning
    match_reasoning JSONB, -- Detailed explanation of score
    strengths JSONB, -- ["Good qualification match", "Preferred location"]
    gaps JSONB, -- ["Age limit close", "Experience slightly low"]
    
    -- Recommendations
    ai_recommendations TEXT, -- Personalized advice for application
    
    -- Metadata
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    score_version VARCHAR(10) DEFAULT '1.0', -- For tracking algorithm changes
    
    UNIQUE(user_id, job_id)
);

-- Indexes for match scores
CREATE INDEX idx_match_scores_user ON job_match_scores(user_id);
CREATE INDEX idx_match_scores_job ON job_match_scores(job_id);
CREATE INDEX idx_match_scores_score ON job_match_scores(match_score DESC);
CREATE INDEX idx_match_scores_calculated ON job_match_scores(calculated_at DESC);

-- ============================================================================
-- USER INTERACTIONS & TRACKING
-- ============================================================================

-- Saved jobs
CREATE TABLE saved_jobs (
    saved_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    job_id INTEGER NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
    notes TEXT,
    reminder_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

CREATE INDEX idx_saved_jobs_user ON saved_jobs(user_id);
CREATE INDEX idx_saved_jobs_job ON saved_jobs(job_id);

-- Applied jobs tracking
CREATE TABLE applied_jobs (
    application_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    job_id INTEGER NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
    
    application_date DATE NOT NULL,
    application_number VARCHAR(100),
    application_status VARCHAR(50) DEFAULT 'applied', -- applied, admitted, rejected, selected
    
    exam_roll_number VARCHAR(100),
    exam_center VARCHAR(200),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, job_id)
);

CREATE INDEX idx_applied_jobs_user ON applied_jobs(user_id);
CREATE INDEX idx_applied_jobs_job ON applied_jobs(job_id);
CREATE INDEX idx_applied_jobs_status ON applied_jobs(application_status);

-- Search history for analytics
CREATE TABLE search_history (
    search_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    
    search_query TEXT,
    filters JSONB, -- {"state": "Karnataka", "qualification": "Graduate", "job_type": "State"}
    
    results_count INTEGER,
    clicked_job_ids INTEGER[], -- Track which results were clicked
    
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_search_history_user ON search_history(user_id);
CREATE INDEX idx_search_history_date ON search_history(searched_at DESC);

-- ============================================================================
-- SCRAPING & CACHING TABLES
-- ============================================================================

-- Scraping sources configuration
CREATE TABLE scraping_sources (
    source_id SERIAL PRIMARY KEY,
    source_name VARCHAR(200) NOT NULL,
    source_url TEXT NOT NULL,
    source_type VARCHAR(50), -- portal, rss, pdf_list
    
    scraping_frequency VARCHAR(20), -- hourly, daily, weekly
    last_scraped_at TIMESTAMP WITH TIME ZONE,
    next_scrape_at TIMESTAMP WITH TIME ZONE,
    
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 5, -- 1-10, higher = more important
    
    scraper_config JSONB, -- Custom configuration for each source
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_scraping_sources_next_scrape ON scraping_sources(next_scrape_at);
CREATE INDEX idx_scraping_sources_active ON scraping_sources(is_active);

-- Scraping logs for monitoring
CREATE TABLE scraping_logs (
    log_id SERIAL PRIMARY KEY,
    source_id INTEGER REFERENCES scraping_sources(source_id),
    
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    status VARCHAR(20), -- success, failed, partial
    jobs_found INTEGER DEFAULT 0,
    jobs_new INTEGER DEFAULT 0,
    jobs_updated INTEGER DEFAULT 0,
    
    error_message TEXT,
    error_details JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_scraping_logs_source ON scraping_logs(source_id);
CREATE INDEX idx_scraping_logs_status ON scraping_logs(status);
CREATE INDEX idx_scraping_logs_date ON scraping_logs(started_at DESC);

-- Cache for popular searches
CREATE TABLE search_cache (
    cache_id SERIAL PRIMARY KEY,
    cache_key VARCHAR(500) NOT NULL UNIQUE, -- Hash of search parameters
    
    search_params JSONB NOT NULL,
    result_job_ids INTEGER[] NOT NULL,
    result_count INTEGER NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    hit_count INTEGER DEFAULT 0,
    last_hit_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_search_cache_key ON search_cache(cache_key);
CREATE INDEX idx_search_cache_expires ON search_cache(expires_at);

-- ============================================================================
-- NOTIFICATIONS & ALERTS
-- ============================================================================

-- User notification preferences for jobs
CREATE TABLE job_alerts (
    alert_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    
    alert_name VARCHAR(200),
    
    -- Alert criteria
    filters JSONB NOT NULL, -- Search criteria to match
    
    frequency VARCHAR(20) DEFAULT 'daily', -- instant, daily, weekly
    is_active BOOLEAN DEFAULT TRUE,
    
    last_sent_at TIMESTAMP WITH TIME ZONE,
    next_send_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_job_alerts_user ON job_alerts(user_id);
CREATE INDEX idx_job_alerts_next_send ON job_alerts(next_send_at);

-- Notification queue
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    
    notification_type VARCHAR(50), -- job_alert, application_update, exam_reminder
    
    title VARCHAR(300),
    message TEXT,
    action_url TEXT,
    
    channels JSONB DEFAULT '["email"]'::jsonb, -- email, sms, whatsapp, push
    
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, failed
    sent_at TIMESTAMP WITH TIME ZONE,
    
    metadata JSONB, -- Additional data like job_id, etc.
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================================================
-- PAYMENT & SUBSCRIPTION TRACKING
-- ============================================================================

-- Payments table
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    
    payment_method VARCHAR(50), -- razorpay, upi, card
    payment_gateway VARCHAR(50),
    transaction_id VARCHAR(200) UNIQUE,
    
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, success, failed, refunded
    
    subscription_type VARCHAR(20), -- yearly, monthly
    subscription_start DATE,
    subscription_end DATE,
    
    metadata JSONB, -- Gateway-specific data
    
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);

-- ============================================================================
-- ANALYTICS & METRICS
-- ============================================================================

-- Daily job statistics
CREATE TABLE job_statistics (
    stat_id SERIAL PRIMARY KEY,
    stat_date DATE NOT NULL,
    
    total_active_jobs INTEGER DEFAULT 0,
    total_new_jobs INTEGER DEFAULT 0,
    total_expired_jobs INTEGER DEFAULT 0,
    
    jobs_by_type JSONB, -- {"Central": 50, "State": 150, "PSU": 30}
    jobs_by_state JSONB,
    
    total_searches INTEGER DEFAULT 0,
    unique_users_searched INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(stat_date)
);

CREATE INDEX idx_job_statistics_date ON job_statistics(stat_date DESC);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_states_updated_at BEFORE UPDATE ON states
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_districts_updated_at BEFORE UPDATE ON districts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_taluks_updated_at BEFORE UPDATE ON taluks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applied_jobs_updated_at BEFORE UPDATE ON applied_jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL SEED DATA (Sample States)
-- ============================================================================

-- Insert major Indian states (sample)
INSERT INTO states (state_name, state_code, region, capital) VALUES
    ('Karnataka', 'KA', 'South', 'Bengaluru'),
    ('Maharashtra', 'MH', 'West', 'Mumbai'),
    ('Tamil Nadu', 'TN', 'South', 'Chennai'),
    ('Delhi', 'DL', 'North', 'New Delhi'),
    ('Uttar Pradesh', 'UP', 'North', 'Lucknow'),
    ('Gujarat', 'GJ', 'West', 'Gandhinagar'),
    ('Rajasthan', 'RJ', 'North', 'Jaipur'),
    ('West Bengal', 'WB', 'East', 'Kolkata'),
    ('Madhya Pradesh', 'MP', 'Central', 'Bhopal'),
    ('Andhra Pradesh', 'AP', 'South', 'Amaravati')
ON CONFLICT (state_name) DO NOTHING;

-- Insert sample job categories
INSERT INTO job_categories (category_name) VALUES
    ('Banking & Finance'),
    ('Railway'),
    ('Defense & Police'),
    ('Teaching & Education'),
    ('Medical & Healthcare'),
    ('Engineering'),
    ('Administrative Services'),
    ('Public Sector Undertakings'),
    ('Postal Services'),
    ('Judiciary & Legal')
ON CONFLICT (category_name) DO NOTHING;

-- ============================================================================
-- COMMENTS & DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE states IS 'Indian states and union territories';
COMMENT ON TABLE districts IS 'Districts within states';
COMMENT ON TABLE taluks IS 'Taluks/Tehsils/Blocks (sub-district administrative units)';
COMMENT ON TABLE users IS 'User profiles with subscription and preference data';
COMMENT ON TABLE jobs IS 'Cached government job notifications with AI processing';
COMMENT ON TABLE job_match_scores IS 'AI-driven match scores between users and jobs';
COMMENT ON TABLE saved_jobs IS 'Jobs bookmarked by users';
COMMENT ON TABLE applied_jobs IS 'Track user job applications and their status';
COMMENT ON TABLE search_cache IS 'Cache for frequently executed searches';
COMMENT ON TABLE scraping_sources IS 'Configuration for job scraping sources';
COMMENT ON TABLE scraping_logs IS 'Logs for monitoring scraper health';
COMMENT ON TABLE job_alerts IS 'User-configured job alert criteria';
COMMENT ON TABLE notifications IS 'Notification delivery queue';
COMMENT ON TABLE payments IS 'Payment and subscription transactions';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
