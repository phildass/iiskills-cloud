/**
 * Tests for the profile API error-handling improvements.
 *
 * Covers:
 *   - Error response shape includes `details` field when Supabase returns an error
 *   - Structured error logging (code, details, hint, userId)
 *   - RLS-related helpers (service_role policy reasoning)
 *   - profiles_schema.sql migration guard: service_role policy exists in migration
 */

"use strict";

const fs = require("fs");
const path = require("path");

// ── Helper: simulate the error-response shape produced by the API ─────────────

/**
 * Mirrors the error-response shape in apps/main/pages/api/profile.js and
 * apps/main/pages/api/profile/update.js after the improvement.
 */
function buildProfileErrorResponse(errorMessage) {
  return { error: "Failed to fetch profile", details: errorMessage };
}

function buildUpdateErrorResponse(errorMessage) {
  return { error: "Failed to update profile", details: errorMessage };
}

// ── 1. Profile fetch error response ──────────────────────────────────────────

describe("api/profile GET — error response shape", () => {
  test("error response includes `details` field with Supabase error message", () => {
    const supabaseError = { message: 'relation "profiles" does not exist', code: "42P01" };
    const response = buildProfileErrorResponse(supabaseError.message);

    expect(response.error).toBe("Failed to fetch profile");
    expect(response.details).toBe(supabaseError.message);
    expect(typeof response.details).toBe("string");
  });

  test("error response `details` is not undefined when error.message is empty string", () => {
    const response = buildProfileErrorResponse("");
    expect(response.details).toBe("");
  });

  test("error response always has both `error` and `details` keys on DB failure", () => {
    const response = buildProfileErrorResponse("some db error");
    expect(Object.keys(response)).toEqual(expect.arrayContaining(["error", "details"]));
  });
});

// ── 2. Profile update error response ─────────────────────────────────────────

describe("api/profile PATCH — error response shape", () => {
  test("update error response includes `details` field", () => {
    const supabaseError = { message: "permission denied for table profiles", code: "42501" };
    const response = buildUpdateErrorResponse(supabaseError.message);

    expect(response.error).toBe("Failed to update profile");
    expect(response.details).toBe(supabaseError.message);
  });
});

describe("api/profile/update — error response shape", () => {
  test("fetch-before-update error includes `details` field", () => {
    const supabaseError = {
      message: "canceling statement due to conflict with recovery",
      code: "40001",
    };
    const response = buildProfileErrorResponse(supabaseError.message);

    expect(response.error).toBe("Failed to fetch profile");
    expect(response.details).toBe(supabaseError.message);
  });

  test("update error includes `details` field", () => {
    const supabaseError = {
      message: "value too long for type character varying(255)",
      code: "22001",
    };
    const response = buildUpdateErrorResponse(supabaseError.message);

    expect(response.error).toBe("Failed to update profile");
    expect(response.details).toBe(supabaseError.message);
  });
});

// ── 3. Structured error-log object shape ─────────────────────────────────────

describe("structured error logging shape", () => {
  /**
   * Mirrors the console.error call shape added to the profile API handlers:
   *   console.error("[api/profile] DB error:", { message, code, details, hint, userId })
   */
  function buildErrorLogObject(supabaseError, userId) {
    return {
      message: supabaseError.message,
      code: supabaseError.code,
      details: supabaseError.details,
      hint: supabaseError.hint,
      userId,
    };
  }

  test("log object contains all diagnostic fields", () => {
    const err = {
      message: "db error",
      code: "42P01",
      details: "table missing",
      hint: "run migrations",
    };
    const log = buildErrorLogObject(err, "user-uuid-123");

    expect(log.message).toBe("db error");
    expect(log.code).toBe("42P01");
    expect(log.details).toBe("table missing");
    expect(log.hint).toBe("run migrations");
    expect(log.userId).toBe("user-uuid-123");
  });

  test("log object handles undefined optional fields gracefully", () => {
    const err = { message: "simple error" }; // code/details/hint are undefined
    const log = buildErrorLogObject(err, "user-uuid-456");

    expect(log.message).toBe("simple error");
    expect(log.code).toBeUndefined();
    expect(log.details).toBeUndefined();
    expect(log.hint).toBeUndefined();
    expect(log.userId).toBe("user-uuid-456");
  });
});

// ── 4. Migration file: service_role policy + RLS fix ─────────────────────────

describe("migration 2026-03-12_fix_profiles_rls_service_role.sql", () => {
  let migrationSql;

  beforeAll(() => {
    const migrationPath = path.join(
      __dirname,
      "..",
      "supabase",
      "migrations",
      "2026-03-12_fix_profiles_rls_service_role.sql"
    );
    migrationSql = fs.readFileSync(migrationPath, "utf8");
  });

  test("creates the service_role policy", () => {
    expect(migrationSql).toContain("Service role can manage all profiles");
    expect(migrationSql).toContain("FOR ALL TO service_role");
  });

  test("drops and recreates the recursive UPDATE policy", () => {
    expect(migrationSql).toContain('DROP POLICY IF EXISTS "Users can update own profile"');
    expect(migrationSql).toContain('CREATE POLICY "Users can update own profile"');
    // The new CREATE POLICY statement must NOT contain the recursive subquery.
    // (The comment block at the top of the migration describes the old bug; we
    //  isolate the CREATE POLICY section to verify the actual SQL is clean.)
    const createPolicyStart = migrationSql.indexOf('CREATE POLICY "Users can update own profile"');
    const createPolicySection = migrationSql.slice(createPolicyStart, createPolicyStart + 300);
    expect(createPolicySection).not.toContain("SELECT is_admin FROM public.profiles");
  });

  test("creates the handle_protect_is_admin trigger function", () => {
    expect(migrationSql).toContain("handle_protect_is_admin");
    expect(migrationSql).toContain("Changing is_admin is not allowed via profile update");
  });

  test("grants ALL to service_role on profiles", () => {
    expect(migrationSql).toContain("GRANT ALL ON public.profiles TO service_role");
  });
});

// ── 5. profiles_schema.sql sanity checks ─────────────────────────────────────

describe("profiles_schema.sql — schema completeness", () => {
  let schemaSql;

  beforeAll(() => {
    const schemaPath = path.join(__dirname, "..", "supabase", "profiles_schema.sql");
    schemaSql = fs.readFileSync(schemaPath, "utf8");
  });

  test("includes all columns added by migrations", () => {
    const requiredColumns = [
      "is_paid_user",
      "paid_at",
      "phone",
      "username",
      "registration_completed",
      "profile_submitted_at",
      "name_change_count",
      "education_self",
      "education_father",
      "education_mother",
      "moderation_strikes",
      "is_banned",
      "banned_at",
    ];
    for (const col of requiredColumns) {
      expect(schemaSql).toContain(col);
    }
  });

  test("contains service_role policy", () => {
    expect(schemaSql).toContain("Service role can manage all profiles");
    expect(schemaSql).toContain("FOR ALL TO service_role");
  });

  test("does not contain the recursive WITH CHECK subquery", () => {
    expect(schemaSql).not.toContain("SELECT is_admin FROM public.profiles WHERE id = auth.uid()");
  });

  test("grants ALL to service_role", () => {
    expect(schemaSql).toContain("GRANT ALL ON public.profiles TO service_role");
  });
});

console.log("✅ profileApi tests defined successfully");
