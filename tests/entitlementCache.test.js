/**
 * Tests for entitlementCache.js
 *
 * Validates:
 *  1. getEntitlementFromCache returns null on miss (empty cache)
 *  2. setEntitlementInCache + getEntitlementFromCache round-trip (true)
 *  3. setEntitlementInCache + getEntitlementFromCache round-trip (false)
 *  4. invalidateEntitlementCache(userId, appId) removes a specific entry
 *  5. invalidateEntitlementCache(userId) removes ALL entries for that user
 *  6. TTL expiry — entries older than ttlSeconds are not returned
 *  7. Different users have independent cache entries
 *  8. Re-setting a key overwrites the previous value
 */

"use strict";

// ---------------------------------------------------------------------------
// We test only the in-process Map path (no Redis) so the tests never need a
// running Redis server.  We access the exported _testInProcessCache directly.
// ---------------------------------------------------------------------------

const {
  getEntitlementFromCache,
  setEntitlementInCache,
  invalidateEntitlementCache,
  _testInProcessCache,
} = require("../packages/shared-utils/lib/entitlementCache");

// Keep the in-process cache clean between tests.
beforeEach(() => {
  _testInProcessCache.clear();
});

// ---------------------------------------------------------------------------
// Cache miss
// ---------------------------------------------------------------------------

describe("getEntitlementFromCache — cache miss", () => {
  it("returns null when the cache is empty", async () => {
    const result = await getEntitlementFromCache("user-1", "learn-ai");
    expect(result).toBeNull();
  });

  it("returns null for an unknown user/app pair", async () => {
    await setEntitlementInCache("user-A", "learn-ai", true);
    const result = await getEntitlementFromCache("user-B", "learn-ai");
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Round-trip
// ---------------------------------------------------------------------------

describe("setEntitlementInCache + getEntitlementFromCache — round-trip", () => {
  it("stores true and retrieves true", async () => {
    await setEntitlementInCache("user-1", "learn-ai", true);
    const result = await getEntitlementFromCache("user-1", "learn-ai");
    expect(result).toBe(true);
  });

  it("stores false and retrieves false", async () => {
    await setEntitlementInCache("user-1", "learn-pr", false);
    const result = await getEntitlementFromCache("user-1", "learn-pr");
    expect(result).toBe(false);
  });

  it("different appIds are stored independently", async () => {
    await setEntitlementInCache("user-1", "learn-ai", true);
    await setEntitlementInCache("user-1", "learn-management", false);
    expect(await getEntitlementFromCache("user-1", "learn-ai")).toBe(true);
    expect(await getEntitlementFromCache("user-1", "learn-management")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Invalidation
// ---------------------------------------------------------------------------

describe("invalidateEntitlementCache", () => {
  it("removes the specific app entry for a user", async () => {
    await setEntitlementInCache("user-1", "learn-ai", true);
    await invalidateEntitlementCache("user-1", "learn-ai");
    expect(await getEntitlementFromCache("user-1", "learn-ai")).toBeNull();
  });

  it("does not affect other apps for the same user when appId is given", async () => {
    await setEntitlementInCache("user-1", "learn-ai", true);
    await setEntitlementInCache("user-1", "learn-developer", true);
    await invalidateEntitlementCache("user-1", "learn-ai");
    // learn-ai gone; learn-developer still present
    expect(await getEntitlementFromCache("user-1", "learn-ai")).toBeNull();
    expect(await getEntitlementFromCache("user-1", "learn-developer")).toBe(true);
  });

  it("removes ALL entries for a user when no appId is given", async () => {
    await setEntitlementInCache("user-1", "learn-ai", true);
    await setEntitlementInCache("user-1", "learn-developer", true);
    await setEntitlementInCache("user-1", "learn-management", false);
    await invalidateEntitlementCache("user-1"); // no appId → full user invalidation
    expect(await getEntitlementFromCache("user-1", "learn-ai")).toBeNull();
    expect(await getEntitlementFromCache("user-1", "learn-developer")).toBeNull();
    expect(await getEntitlementFromCache("user-1", "learn-management")).toBeNull();
  });

  it("does not affect other users when invalidating a specific user", async () => {
    await setEntitlementInCache("user-1", "learn-ai", true);
    await setEntitlementInCache("user-2", "learn-ai", true);
    await invalidateEntitlementCache("user-1", "learn-ai");
    expect(await getEntitlementFromCache("user-1", "learn-ai")).toBeNull();
    expect(await getEntitlementFromCache("user-2", "learn-ai")).toBe(true);
  });

  it("is safe to call when no entry exists (no error thrown)", async () => {
    await expect(
      invalidateEntitlementCache("non-existent-user", "learn-ai")
    ).resolves.not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// TTL expiry
// ---------------------------------------------------------------------------

describe("entitlementCache — TTL expiry", () => {
  it("returns null after the TTL has elapsed", async () => {
    // Store with a 0-second TTL (already expired).
    await setEntitlementInCache("user-1", "learn-ai", true, 0);
    // The entry's expiresAt is Date.now() + 0*1000 = now, so it's already expired.
    const result = await getEntitlementFromCache("user-1", "learn-ai");
    expect(result).toBeNull();
  });

  it("returns the value before the TTL elapses", async () => {
    // Store with a large TTL (1 hour) — well within the test window.
    await setEntitlementInCache("user-1", "learn-ai", true, 3600);
    const result = await getEntitlementFromCache("user-1", "learn-ai");
    expect(result).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Overwrite
// ---------------------------------------------------------------------------

describe("entitlementCache — overwrite", () => {
  it("re-setting a key with a new value overwrites the old one", async () => {
    await setEntitlementInCache("user-1", "learn-ai", false);
    expect(await getEntitlementFromCache("user-1", "learn-ai")).toBe(false);

    // User pays — payment confirmation calls invalidate then re-set
    await invalidateEntitlementCache("user-1", "learn-ai");
    await setEntitlementInCache("user-1", "learn-ai", true);
    expect(await getEntitlementFromCache("user-1", "learn-ai")).toBe(true);
  });
});
