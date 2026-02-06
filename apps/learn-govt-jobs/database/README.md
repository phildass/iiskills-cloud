# Database Schema Documentation

## Overview

This directory contains the complete database schema for the Learn Govt Jobs platform. The schema is designed for PostgreSQL 14+ with the PostGIS extension for geo-spatial queries.

## Files

- **init_schema.sql** - Complete DDL for all tables, indexes, triggers, and initial seed data

## Schema Components

### 1. Geography Tables
- `states` - Indian states and union territories
- `districts` - Districts within states
- `taluks` - Taluks/Tehsils/Blocks (sub-district units)

### 2. User Tables
- `users` - User profiles with subscription and preference data
- `user_qualifications` - Educational qualifications
- `user_experience` - Work experience records

### 3. Job Tables
- `jobs` - Cached government job notifications
- `job_categories` - Job classification categories
- `job_match_scores` - AI-driven match scores between users and jobs

### 4. Interaction Tables
- `saved_jobs` - Jobs bookmarked by users
- `applied_jobs` - Track user applications and status
- `search_history` - Analytics on user searches

### 5. Scraping Tables
- `scraping_sources` - Configuration for job sources
- `scraping_logs` - Monitoring scraper health
- `search_cache` - Cache for frequent searches

### 6. Notification Tables
- `job_alerts` - User-configured job alert criteria
- `notifications` - Notification delivery queue

### 7. Payment Tables
- `payments` - Payment and subscription transactions

### 8. Analytics Tables
- `job_statistics` - Daily aggregated statistics

## Setup Instructions

### Prerequisites
- PostgreSQL 14 or higher
- PostGIS extension

### Installation

1. **Create Database:**
```bash
createdb learn_govt_jobs
```

2. **Run Schema:**
```bash
psql learn_govt_jobs < init_schema.sql
```

3. **Verify Installation:**
```sql
-- Check tables
\dt

-- Check extensions
\dx

-- Verify sample data
SELECT * FROM states;
SELECT * FROM job_categories;
```

## Key Features

### JSONB Fields
The schema uses JSONB extensively for flexible data:
- `jobs.vacancies` - Vacancy breakdown by category
- `jobs.ai_tags` - AI-extracted tags
- `jobs.required_qualifications` - Qualification details
- `users.notification_preferences` - User preferences
- `job_match_scores.match_reasoning` - Detailed match explanation

### Indexes
- Standard B-tree indexes for foreign keys and common queries
- GIN indexes for JSONB fields
- Full-text search index on job titles and organizations
- Composite indexes for multi-column queries

### Triggers
- Auto-update `updated_at` timestamps on relevant tables

### Constraints
- Foreign key constraints with CASCADE delete where appropriate
- Unique constraints to prevent duplicates
- NOT NULL constraints for required fields

## Common Queries

### Find Active Jobs in a State
```sql
SELECT 
  j.title,
  j.organization,
  j.total_vacancies,
  j.application_end_date,
  s.state_name
FROM jobs j
JOIN states s ON j.state_id = s.state_id
WHERE j.status = 'active'
  AND j.state_id = 10
ORDER BY j.application_end_date DESC;
```

### Get User's Top Job Matches
```sql
SELECT 
  j.title,
  j.organization,
  m.match_score,
  m.strengths,
  m.gaps
FROM job_match_scores m
JOIN jobs j ON m.job_id = j.job_id
WHERE m.user_id = '123e4567-e89b-12d3-a456-426614174000'
  AND j.status = 'active'
ORDER BY m.match_score DESC
LIMIT 20;
```

### Search Jobs with Filters
```sql
SELECT *
FROM jobs
WHERE status = 'active'
  AND state_id = ANY($1)  -- Array of state IDs
  AND category_id = $2
  AND to_tsvector('english', title || ' ' || organization) @@ plainto_tsquery($3)
ORDER BY application_end_date DESC;
```

### Cache Popular Search
```sql
INSERT INTO search_cache (cache_key, search_params, result_job_ids, result_count, expires_at)
VALUES (
  $1,  -- MD5 hash of search params
  $2,  -- JSON search params
  $3,  -- Array of job IDs
  $4,  -- Count
  NOW() + INTERVAL '1 hour'
)
ON CONFLICT (cache_key) DO UPDATE
SET hit_count = search_cache.hit_count + 1,
    last_hit_at = NOW();
```

## Maintenance

### Regular Tasks

**Clean Expired Cache:**
```sql
DELETE FROM search_cache WHERE expires_at < NOW();
```

**Archive Old Jobs:**
```sql
-- Move jobs older than 1 year to archive table
INSERT INTO jobs_archive 
SELECT * FROM jobs 
WHERE scraped_at < NOW() - INTERVAL '1 year';

DELETE FROM jobs 
WHERE scraped_at < NOW() - INTERVAL '1 year';
```

**Update Statistics:**
```sql
-- Generate daily statistics
INSERT INTO job_statistics (stat_date, total_active_jobs, total_new_jobs)
VALUES (
  CURRENT_DATE,
  (SELECT COUNT(*) FROM jobs WHERE status = 'active'),
  (SELECT COUNT(*) FROM jobs WHERE scraped_at >= CURRENT_DATE)
);
```

### Performance Tuning

**Analyze Tables:**
```sql
ANALYZE jobs;
ANALYZE job_match_scores;
```

**Reindex:**
```sql
REINDEX TABLE jobs;
```

**Vacuum:**
```sql
VACUUM ANALYZE jobs;
```

## Migration Strategy

For production, use a migration tool like:
- **Flyway** (Java)
- **Liquibase** (Java)
- **node-pg-migrate** (Node.js)
- **Alembic** (Python)

Example migration structure:
```
migrations/
  V001__initial_schema.sql
  V002__add_job_indexes.sql
  V003__add_match_scoring.sql
```

## Security Considerations

1. **Row-Level Security (RLS):**
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_isolation ON users
  USING (user_id = current_setting('app.current_user_id')::uuid);
```

2. **Sensitive Data:**
- Never store passwords in this database (use Supabase auth)
- Encrypt payment details
- Hash PII where possible

3. **Access Control:**
- Use separate database users for different services
- Grant minimal required permissions
- Use connection pooling with authentication

## Backup & Recovery

**Backup:**
```bash
pg_dump learn_govt_jobs > backup_$(date +%Y%m%d).sql
```

**Restore:**
```bash
psql learn_govt_jobs < backup_20260206.sql
```

**Point-in-Time Recovery:**
Enable WAL archiving in postgresql.conf:
```
wal_level = replica
archive_mode = on
archive_command = 'cp %p /path/to/archive/%f'
```

## Monitoring

**Key Metrics to Track:**
- Table sizes: `SELECT pg_size_pretty(pg_total_relation_size('jobs'));`
- Index usage: `SELECT * FROM pg_stat_user_indexes;`
- Slow queries: Enable `log_min_duration_statement` in postgresql.conf
- Connection count: `SELECT COUNT(*) FROM pg_stat_activity;`
- Cache hit rate: `SELECT sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) FROM pg_statio_user_tables;`

## Support

For schema-related issues or suggestions:
1. Check the [system_architecture.md](../docs/system_architecture.md) for context
2. Review [recommendations.md](../docs/recommendations.md) for best practices
3. Contact the development team

## Version History

- **v1.0** (2026-02-06) - Initial schema with complete tables and indexes
