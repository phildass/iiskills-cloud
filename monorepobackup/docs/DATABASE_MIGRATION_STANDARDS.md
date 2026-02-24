# Database Migration Standards

**Date**: 2026-02-18  
**Repository**: iiskills-cloud  
**Database**: PostgreSQL (Supabase)  
**Status**: Standards Defined

---

## Overview

This document establishes standards and best practices for database schema migrations in the iiskills-cloud monorepo. These standards ensure database changes are version-controlled, reversible, and safely deployable across environments.

---

## Table of Contents

1. [Migration Tooling](#migration-tooling)
2. [File Structure](#file-structure)
3. [Naming Conventions](#naming-conventions)
4. [Migration Workflow](#migration-workflow)
5. [Best Practices](#best-practices)
6. [Testing Migrations](#testing-migrations)
7. [Rollback Strategy](#rollback-strategy)
8. [Documentation](#documentation)

---

## Migration Tooling

### Current Setup: Supabase CLI

The repository uses Supabase for database management, which includes built-in migration support.

**Location**: `supabase/migrations/`

**Tooling**:
- Supabase CLI for migration creation and application
- SQL files for migration definitions
- Version control via Git

### Alternative Tools (for reference)

- **Prisma**: TypeScript-first ORM with migrations
- **Knex.js**: SQL query builder with migrations
- **db-migrate**: Database-agnostic migration tool
- **Liquibase**: Enterprise-grade migration tool

---

## File Structure

### Directory Layout

```
supabase/
├── migrations/
│   ├── YYYYMMDDHHMMSS_descriptive_name.sql
│   ├── YYYYMMDDHHMMSS_another_migration.sql
│   └── ...
├── seed.sql (optional)
└── config.toml
```

### Migration File Structure

Each migration file should contain:

1. **Header Comment**: Description, author, date
2. **Up Migration**: Changes to apply
3. **Down Migration** (optional): Rollback instructions
4. **Validation**: Checks that changes applied correctly

```sql
-- Migration: Add user_app_access table for access control
-- Author: Development Team
-- Date: 2026-02-18
-- Description: Creates the user_app_access table to track which apps users have access to
-- Related Issue: #123
-- 
-- Rollback: To rollback this migration, run:
--   DROP TABLE IF EXISTS user_app_access;

-- ============================================================================
-- UP MIGRATION
-- ============================================================================

BEGIN;

-- Create user_app_access table
CREATE TABLE IF NOT EXISTS user_app_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  app_id VARCHAR(50) NOT NULL,
  granted_via VARCHAR(20) NOT NULL CHECK (granted_via IN ('payment', 'bundle', 'admin', 'otp', 'promo')),
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  granted_by_admin_id UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_app_access_user_id ON user_app_access(user_id);
CREATE INDEX idx_user_app_access_app_id ON user_app_access(app_id);
CREATE INDEX idx_user_app_access_granted_via ON user_app_access(granted_via);
CREATE INDEX idx_user_app_access_payment_id ON user_app_access(payment_id);

-- Create unique constraint (user can only have one access record per app)
CREATE UNIQUE INDEX idx_user_app_access_unique ON user_app_access(user_id, app_id);

-- Add comments
COMMENT ON TABLE user_app_access IS 'Tracks user access to applications (free, paid, bundle)';
COMMENT ON COLUMN user_app_access.granted_via IS 'How access was granted: payment, bundle, admin, otp, or promo';

-- Create trigger for updated_at
CREATE TRIGGER update_user_app_access_updated_at
  BEFORE UPDATE ON user_app_access
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Validate
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_app_access') THEN
    RAISE EXCEPTION 'Migration failed: user_app_access table was not created';
  END IF;
  
  RAISE NOTICE 'Migration successful: user_app_access table created';
END $$;

COMMIT;

-- ============================================================================
-- DOWN MIGRATION (for reference - not automatically applied)
-- ============================================================================

-- To rollback:
-- BEGIN;
-- DROP TABLE IF EXISTS user_app_access CASCADE;
-- COMMIT;
```

---

## Naming Conventions

### File Names

**Format**: `YYYYMMDDHHMMSS_descriptive_name.sql`

**Examples**:
- `20260218120000_create_user_app_access_table.sql`
- `20260218130000_add_bundle_info_to_payments.sql`
- `20260218140000_create_otp_codes_table.sql`

**Rules**:
- Use timestamp prefix (YYYYMMDDHHmmss)
- Use lowercase with underscores
- Be descriptive but concise
- Use verbs: create, add, modify, remove, rename
- Max 50 characters (excluding timestamp)

### Table Names

- Use plural nouns: `users`, `payments`, `access_records`
- Use snake_case: `user_app_access`, `payment_history`
- Prefix junction tables with both table names: `user_roles`

### Column Names

- Use snake_case: `created_at`, `user_id`, `app_id`
- Use suffixes for types: `_id` (FK), `_at` (timestamp), `_count` (integer)
- Boolean columns: `is_*` or `has_*` prefix: `is_admin`, `has_access`

---

## Migration Workflow

### 1. Create Migration

```bash
# Generate migration file with timestamp
supabase migration new descriptive_name

# Or manually create with timestamp
touch supabase/migrations/$(date +%Y%m%d%H%M%S)_descriptive_name.sql
```

### 2. Write Migration

Follow the file structure template above:
- Add header comment
- Write SQL changes
- Add validations
- Document rollback

### 3. Test Locally

```bash
# Reset local database
supabase db reset

# Apply migrations
supabase db push

# Verify changes
supabase db diff
```

### 4. Review

- Code review by team
- Check for:
  - Breaking changes
  - Performance impact
  - Data loss risks
  - Rollback plan

### 5. Deploy

```bash
# Deploy to staging
supabase db push --db-url $STAGING_DB_URL

# Verify in staging
# Run smoke tests

# Deploy to production
supabase db push --db-url $PRODUCTION_DB_URL

# Monitor for errors
```

### 6. Document

- Update schema documentation
- Update API documentation if needed
- Add to changelog

---

## Best Practices

### 1. Atomic Migrations

- Each migration should do ONE thing
- Wrap in transaction (BEGIN/COMMIT)
- Use `IF NOT EXISTS` / `IF EXISTS` for idempotency

```sql
BEGIN;

-- Do one thing
CREATE TABLE IF NOT EXISTS new_table (...);

-- Verify
DO $$
BEGIN
  IF NOT EXISTS (...) THEN
    RAISE EXCEPTION 'Migration failed';
  END IF;
END $$;

COMMIT;
```

### 2. Backward Compatible Changes

**Safe Operations**:
- ✅ Add new tables
- ✅ Add new columns (with defaults)
- ✅ Add indexes (concurrently)
- ✅ Add check constraints (NOT VALID, then validate)

**Risky Operations**:
- ⚠️ Remove columns (requires code deploy first)
- ⚠️ Rename columns (use views for transition)
- ⚠️ Change column types (requires data migration)
- ⚠️ Add NOT NULL without default

**Breaking Operations**:
- ❌ Drop tables without deprecation period
- ❌ Remove columns in use
- ❌ Change primary keys

### 3. Performance Considerations

#### Create Indexes Concurrently

```sql
-- Don't block writes
CREATE INDEX CONCURRENTLY idx_user_email ON users(email);

-- Regular index creation blocks writes
-- CREATE INDEX idx_user_email ON users(email);
```

#### Add Constraints Without Locking

```sql
-- Step 1: Add constraint as NOT VALID (no lock)
ALTER TABLE users ADD CONSTRAINT check_email_format 
  CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') NOT VALID;

-- Step 2: Validate (can be done during low traffic)
ALTER TABLE users VALIDATE CONSTRAINT check_email_format;
```

#### Large Data Migrations

```sql
-- Use batching for large updates
DO $$
DECLARE
  batch_size INTEGER := 10000;
  rows_updated INTEGER;
BEGIN
  LOOP
    UPDATE users
    SET normalized_email = LOWER(email)
    WHERE id IN (
      SELECT id FROM users
      WHERE normalized_email IS NULL
      LIMIT batch_size
    );
    
    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    EXIT WHEN rows_updated = 0;
    
    RAISE NOTICE 'Updated % rows', rows_updated;
    PERFORM pg_sleep(0.1); -- Throttle
  END LOOP;
END $$;
```

### 4. Data Safety

#### Backup Before Destructive Changes

```sql
-- Create backup table
CREATE TABLE users_backup AS SELECT * FROM users;

-- Make changes
ALTER TABLE users DROP COLUMN old_column;

-- Verify everything works

-- Drop backup (after verification period)
-- DROP TABLE users_backup;
```

#### Soft Deletes Over Hard Deletes

```sql
-- Add deleted_at column
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ;

-- Soft delete
UPDATE users SET deleted_at = NOW() WHERE id = $1;

-- Query active records
SELECT * FROM users WHERE deleted_at IS NULL;
```

### 5. Testing in Migrations

```sql
-- Validate data after migration
DO $$
DECLARE
  invalid_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO invalid_count
  FROM users
  WHERE email NOT LIKE '%@%';
  
  IF invalid_count > 0 THEN
    RAISE EXCEPTION 'Found % users with invalid emails', invalid_count;
  END IF;
  
  RAISE NOTICE 'All emails are valid';
END $$;
```

---

## Testing Migrations

### 1. Local Testing

```bash
# Reset database
supabase db reset

# Apply migrations
supabase migration up

# Verify
supabase db diff
psql $DATABASE_URL -c "SELECT * FROM user_app_access LIMIT 5;"
```

### 2. Integration Tests

```javascript
// tests/migrations/user-app-access.test.js
describe('user_app_access migration', () => {
  it('should create table with correct structure', async () => {
    const { data: columns } = await supabase
      .rpc('get_table_columns', { table_name: 'user_app_access' });
    
    expect(columns).toContainEqual(
      expect.objectContaining({ column_name: 'user_id', data_type: 'uuid' })
    );
  });
  
  it('should enforce unique constraint', async () => {
    // Try to insert duplicate
    const { error } = await supabase
      .from('user_app_access')
      .insert([
        { user_id: 'uuid1', app_id: 'learn-ai', granted_via: 'payment' },
        { user_id: 'uuid1', app_id: 'learn-ai', granted_via: 'payment' }
      ]);
    
    expect(error).toBeDefined();
    expect(error.code).toBe('23505'); // unique violation
  });
});
```

### 3. Staging Verification

```bash
# Deploy to staging
supabase db push --db-url $STAGING_DB_URL

# Run smoke tests
npm run test:smoke

# Check logs for errors
supabase functions logs

# Monitor performance
# Check slow queries, lock waits, etc.
```

---

## Rollback Strategy

### Planning Rollbacks

Every migration should have a documented rollback plan:

1. **Can it be rolled back safely?**
   - Some migrations (data loss) cannot be rolled back
   - Document this clearly

2. **How to rollback?**
   - SQL commands to reverse changes
   - Impact on application

3. **When to rollback?**
   - Define criteria for rollback
   - Monitor metrics after deploy

### Rollback Scenarios

#### Scenario 1: Simple Schema Change

```sql
-- Migration: Add column
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Rollback:
ALTER TABLE users DROP COLUMN phone;
```

#### Scenario 2: Data Migration

```sql
-- Migration: Split name into first/last
UPDATE users SET
  first_name = SPLIT_PART(name, ' ', 1),
  last_name = SPLIT_PART(name, ' ', 2);

-- Rollback: Impossible without backup
-- Requires backup table or original data preservation
```

#### Scenario 3: Breaking Change

```sql
-- Migration: Rename column
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN email_address VARCHAR(255);

-- Step 2: Copy data
UPDATE users SET email_address = email;

-- Step 3: Keep both columns for transition period
-- (Don't drop old column immediately)

-- After code is deployed and verified:
-- ALTER TABLE users DROP COLUMN email;
```

### Emergency Rollback Procedure

```bash
# 1. Identify problematic migration
supabase migration list

# 2. Create rollback migration
supabase migration new rollback_previous_migration

# 3. Write reverse SQL in new migration

# 4. Apply rollback
supabase db push

# 5. Verify
npm run test:smoke

# 6. Monitor
# Check logs, metrics, error rates
```

---

## Documentation Requirements

### 1. Migration File Comments

- Clear description of what changed
- Why the change was needed
- Related tickets/issues
- Rollback instructions
- Author and date

### 2. Schema Documentation

Update `docs/DATABASE_SCHEMA.md`:
- Add new tables
- Document relationships
- Explain complex logic
- Include examples

### 3. API Documentation

Update API docs if schema changes affect:
- Request/response formats
- Available endpoints
- Query parameters

### 4. Changelog

Add to `CHANGELOG.md`:
```markdown
## [1.2.0] - 2026-02-18

### Added
- User app access tracking table
- Bundle access support
- Access via payment, bundle, admin, or OTP

### Changed
- Payment table now includes bundle_apps array

### Database
- Migration: 20260218120000_create_user_app_access_table.sql
```

---

## Checklist Template

### Pre-Migration Checklist

- [ ] Migration file follows naming convention
- [ ] Header comment is complete
- [ ] SQL is wrapped in transaction
- [ ] Includes validation checks
- [ ] Tested locally
- [ ] Rollback plan documented
- [ ] Performance impact assessed
- [ ] Code review completed
- [ ] Staging deployment planned

### Post-Migration Checklist

- [ ] Migration applied successfully
- [ ] No errors in logs
- [ ] Performance metrics normal
- [ ] Application functioning correctly
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Team notified

---

## Tools and Resources

### Supabase CLI Commands

```bash
# Create new migration
supabase migration new <name>

# List migrations
supabase migration list

# Apply migrations
supabase db push

# Rollback migrations
supabase migration down

# Generate migration from current schema
supabase db diff

# Reset database (local only)
supabase db reset
```

### Useful SQL Queries

```sql
-- List all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- List columns in a table
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'users';

-- Check table size
SELECT pg_size_pretty(pg_total_relation_size('users'));

-- Find slow queries
SELECT query, mean_exec_time FROM pg_stat_statements
ORDER BY mean_exec_time DESC LIMIT 10;

-- List indexes
SELECT indexname, indexdef FROM pg_indexes
WHERE tablename = 'users';
```

---

## References

- [Supabase Migration Guide](https://supabase.com/docs/guides/database/migrations)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Refactoring Best Practices](https://www.martinfowler.com/articles/evodb.html)
- [Zero-Downtime Migrations](https://stripe.com/blog/online-migrations)

---

**Last Updated**: 2026-02-18  
**Maintained By**: Development Team  
**Status**: Active
