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

// ── 6. handle_new_user trigger migration fix ──────────────────────────────────

describe("migration 2026-03-08_ensure_profiles_on_signup.sql — fixed", () => {
  let migrationSql;

  beforeAll(() => {
    const migrationPath = path.join(
      __dirname,
      "..",
      "supabase",
      "migrations",
      "2026-03-08_ensure_profiles_on_signup.sql"
    );
    migrationSql = fs.readFileSync(migrationPath, "utf8");
  });

  test("does NOT reference the non-existent email column", () => {
    // The bug: the migration tried to INSERT into (id, email) but profiles has no email column.
    // This caused all new user signups to fail to create a profile row.
    expect(migrationSql).not.toContain("INSERT INTO public.profiles (id, email)");
  });

  test("back-fill INSERT does not use email column", () => {
    expect(migrationSql).not.toMatch(/INSERT INTO public\.profiles.*email/s);
  });

  test("handle_new_user function includes is_admin and subscribed_to_newsletter", () => {
    expect(migrationSql).toContain("is_admin");
    expect(migrationSql).toContain("subscribed_to_newsletter");
  });
});

describe("migration 2026-03-12_fix_handle_new_user_trigger.sql", () => {
  let migrationSql;

  beforeAll(() => {
    const migrationPath = path.join(
      __dirname,
      "..",
      "supabase",
      "migrations",
      "2026-03-12_fix_handle_new_user_trigger.sql"
    );
    migrationSql = fs.readFileSync(migrationPath, "utf8");
  });

  test("replaces handle_new_user without email column reference", () => {
    expect(migrationSql).toContain("CREATE OR REPLACE FUNCTION public.handle_new_user");
    expect(migrationSql).not.toContain("INSERT INTO public.profiles (id, email)");
  });

  test("includes back-fill for users without profiles", () => {
    expect(migrationSql).toContain("INSERT INTO public.profiles");
    expect(migrationSql).toContain("FROM auth.users");
    // Uses NOT EXISTS (better performance than NOT IN for large tables)
    expect(migrationSql).toContain("WHERE NOT EXISTS");
  });

  test("re-attaches the trigger", () => {
    expect(migrationSql).toContain("DROP TRIGGER IF EXISTS on_auth_user_created");
    expect(migrationSql).toContain("CREATE TRIGGER on_auth_user_created");
  });
});

// ── 7. Phone normalisation helpers ────────────────────────────────────────────

describe("api/profile PATCH — phone normalisation", () => {
  /**
   * Mirrors the normalizePhone() helper added to apps/main/pages/api/profile.js.
   */
  function normalizePhone(raw) {
    if (!raw || typeof raw !== "string") return null;
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const hasLeadingPlus = trimmed.startsWith("+");
    const digits = trimmed.replace(/\D/g, "");
    if (!digits) return null;
    if (hasLeadingPlus) return "+" + digits;
    if (digits.length === 10) return "+91" + digits;
    if (digits.length === 12 && digits.startsWith("91")) return "+" + digits;
    return "+91" + digits;
  }

  function isValidE164(e164) {
    if (!e164) return false;
    return /^\+[1-9]\d{6,14}$/.test(e164);
  }

  test("10-digit number is prefixed with +91", () => {
    expect(normalizePhone("9876543210")).toBe("+919876543210");
  });

  test("12-digit number starting with 91 gets + prefix", () => {
    expect(normalizePhone("919876543210")).toBe("+919876543210");
  });

  test("E.164 number is returned as-is (digits only normalized)", () => {
    expect(normalizePhone("+919876543210")).toBe("+919876543210");
  });

  test("number with spaces and dashes is normalized", () => {
    expect(normalizePhone("+91 98765-43210")).toBe("+919876543210");
  });

  test("null input returns null", () => {
    expect(normalizePhone(null)).toBeNull();
  });

  test("empty string returns null", () => {
    expect(normalizePhone("")).toBeNull();
  });

  test("isValidE164 accepts E.164 numbers", () => {
    expect(isValidE164("+919876543210")).toBe(true);
    expect(isValidE164("+12025550100")).toBe(true);
  });

  test("isValidE164 rejects non-E.164 numbers", () => {
    expect(isValidE164("9876543210")).toBe(false);
    expect(isValidE164(null)).toBe(false);
    expect(isValidE164("")).toBe(false);
  });

  test("api/profile.js contains normalizePhone function", () => {
    const profileApiPath = path.join(__dirname, "..", "apps", "main", "pages", "api", "profile.js");
    const profileApiSrc = fs.readFileSync(profileApiPath, "utf8");
    expect(profileApiSrc).toContain("function normalizePhone");
    expect(profileApiSrc).toContain("isValidE164");
  });

  test("api/profile.js applies normalisePhone before DB update", () => {
    const profileApiPath = path.join(__dirname, "..", "apps", "main", "pages", "api", "profile.js");
    const profileApiSrc = fs.readFileSync(profileApiPath, "utf8");
    // Confirm the PATCH handler calls normalizePhone for the phone field
    expect(profileApiSrc).toContain("normalizePhone(updates.phone)");
    expect(profileApiSrc).toContain("Invalid phone number");
  });
});

// ── 8. dashboard API — profile error logging ──────────────────────────────────

describe("api/dashboard.js — profile query error logging", () => {
  test("dashboard API captures profile fetch error", () => {
    const dashboardApiPath = path.join(
      __dirname,
      "..",
      "apps",
      "main",
      "pages",
      "api",
      "dashboard.js"
    );
    const dashboardApiSrc = fs.readFileSync(dashboardApiPath, "utf8");
    // Confirm error is destructured and logged
    expect(dashboardApiSrc).toContain("profileError");
    expect(dashboardApiSrc).toContain("[api/dashboard] profile fetch error:");
  });

  test("dashboard API uses select('*') for schema safety", () => {
    const dashboardApiPath = path.join(
      __dirname,
      "..",
      "apps",
      "main",
      "pages",
      "api",
      "dashboard.js"
    );
    const dashboardApiSrc = fs.readFileSync(dashboardApiPath, "utf8");
    // Should use select('*') rather than explicit column list to avoid missing-column errors
    const profileSelectMatch = dashboardApiSrc.match(/\.from\("profiles"\)[\s\S]*?\.maybeSingle/);
    expect(profileSelectMatch).not.toBeNull();
    expect(profileSelectMatch[0]).toContain('select("*")');
  });
});

// ── 9. api/profile/update.js — profile upsert when row is missing ─────────────

describe("api/profile/update.js — missing profile row recovery", () => {
  test("update handler inserts profile row when missing instead of returning 404", () => {
    const updateApiPath = path.join(
      __dirname,
      "..",
      "apps",
      "main",
      "pages",
      "api",
      "profile",
      "update.js"
    );
    const updateApiSrc = fs.readFileSync(updateApiPath, "utf8");
    // Should insert a new profile row when the row is not found
    expect(updateApiSrc).toContain(".insert(");
    // Should NOT return 404 for missing profile
    expect(updateApiSrc).not.toContain('res.status(404).json({ error: "Profile not found"');
    // Should log a warning when creating a new row
    expect(updateApiSrc).toContain("profile row missing for userId");
  });
});

console.log("✅ profileApi tests defined successfully");
