/**
 * Entitlement Cache
 *
 * Server-side cache for entitlement lookups keyed by `userId:appId`.
 *
 * Storage back-ends (in priority order):
 *   1. Redis — used when the `REDIS_URL` or `REDIS_PRIVATE_URL` environment
 *      variable is set and `ioredis` is available.  Provides true distributed
 *      caching that is consistent across multiple server instances.
 *   2. In-process TTL Map — used as a graceful fallback when Redis is not
 *      configured or unavailable.  Prevents redundant DB calls within the same
 *      process.
 *
 * Consistency guarantee:
 *   `invalidateEntitlementCache(userId, appId)` MUST be called immediately
 *   after a user's status is upgraded to "Paid" (e.g. in
 *   `/api/payments/confirm`).  This ensures the NEXT entitlement check
 *   reads fresh data from the database rather than a stale cached value.
 *
 * Usage (server-side API routes only — never import from client components):
 *
 *   import {
 *     getEntitlementFromCache,
 *     setEntitlementInCache,
 *     invalidateEntitlementCache,
 *   } from '@lib/entitlementCache';
 *
 *   // Read
 *   const cached = await getEntitlementFromCache(userId, appId);
 *   if (cached !== null) return cached; // cache hit
 *
 *   // Compute …
 *
 *   // Write
 *   await setEntitlementInCache(userId, appId, result);
 *
 *   // Invalidate on upgrade
 *   await invalidateEntitlementCache(userId, appId);
 */

/** Default TTL in seconds (5 minutes). */
const DEFAULT_TTL_SECONDS = 300;

/** Cache key prefix — all Redis keys are namespaced here. */
const PREFIX = "entitlement:";

// ---------------------------------------------------------------------------
// In-process TTL Map (fallback when Redis is absent)
// ---------------------------------------------------------------------------

/** @type {Map<string, { value: boolean, expiresAt: number }>} */
const _inProcess = new Map();

function _ipGet(key) {
  const entry = _inProcess.get(key);
  if (!entry) return null;
  // Use >= so a TTL of 0 means "already expired — return null immediately".
  if (Date.now() >= entry.expiresAt) {
    _inProcess.delete(key);
    return null;
  }
  return entry.value;
}

function _ipSet(key, value, ttlSeconds) {
  _inProcess.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

function _ipDel(prefix) {
  for (const key of _inProcess.keys()) {
    if (key.startsWith(prefix)) _inProcess.delete(key);
  }
}

// ---------------------------------------------------------------------------
// Redis adapter (optional — loaded once, lazily)
// ---------------------------------------------------------------------------

/** @type {import('ioredis').Redis | null} */
let _redis = null;
/** Set to true after the first initialisation attempt. */
let _redisAttempted = false;

/**
 * Returns an ioredis client when Redis is configured and reachable, or
 * `null` when Redis is not configured / ioredis is not installed.
 *
 * @returns {Promise<import('ioredis').Redis | null>}
 */
async function _getRedis() {
  if (_redisAttempted) return _redis;
  _redisAttempted = true;

  const url = process.env.REDIS_URL || process.env.REDIS_PRIVATE_URL;
  if (!url) return null;

  try {
    // Dynamic import so the module compiles and runs even without ioredis installed.
    const { default: Redis } = await import("ioredis");
    const client = new Redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      enableOfflineQueue: false,
    });

    client.on("error", (err) => {
      console.warn(
        "[entitlementCache] Redis error — falling back to in-process cache:",
        err.message
      );
      // Allow a fresh connection attempt on the next request.
      _redis = null;
      _redisAttempted = false;
    });

    await client.connect();
    _redis = client;
    return _redis;
  } catch (err) {
    console.warn("[entitlementCache] Redis unavailable — using in-process cache:", err.message);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Build the cache key for a user + app pair.
 *
 * @param {string} userId
 * @param {string} appId
 * @returns {string}
 */
function _key(userId, appId) {
  return `${PREFIX}${userId}:${appId}`;
}

/**
 * Read a cached entitlement result.
 *
 * @param {string} userId
 * @param {string} appId
 * @returns {Promise<boolean|null>} `true`/`false` on cache hit; `null` on miss.
 */
export async function getEntitlementFromCache(userId, appId) {
  const key = _key(userId, appId);
  try {
    const redis = await _getRedis();
    if (redis) {
      const raw = await redis.get(key);
      if (raw === null) return null; // cache miss
      return raw === "true";
    }
  } catch (err) {
    console.warn("[entitlementCache] Redis get error:", err.message);
  }
  // Fallback
  return _ipGet(key);
}

/**
 * Store an entitlement result in the cache.
 *
 * @param {string}  userId
 * @param {string}  appId
 * @param {boolean} value          - Entitlement result to cache.
 * @param {number}  [ttlSeconds]   - Override TTL (default: 300 s).
 * @returns {Promise<void>}
 */
export async function setEntitlementInCache(
  userId,
  appId,
  value,
  ttlSeconds = DEFAULT_TTL_SECONDS
) {
  const key = _key(userId, appId);
  try {
    const redis = await _getRedis();
    if (redis) {
      await redis.setex(key, ttlSeconds, value ? "true" : "false");
      return;
    }
  } catch (err) {
    console.warn("[entitlementCache] Redis set error:", err.message);
  }
  // Fallback
  _ipSet(key, value, ttlSeconds);
}

/**
 * Invalidate cached entitlement(s) for a user.
 *
 * Call this IMMEDIATELY after a user's status is upgraded to "Paid" so the
 * next entitlement check reads fresh data from the database.
 *
 * @param {string}      userId
 * @param {string|null} [appId] - When provided, only the specific app's entry
 *                                is deleted.  When omitted, ALL entries for
 *                                the user are deleted (full user invalidation).
 * @returns {Promise<void>}
 */
export async function invalidateEntitlementCache(userId, appId = null) {
  const exactKey = appId ? _key(userId, appId) : null;
  const userPrefix = `${PREFIX}${userId}:`;

  try {
    const redis = await _getRedis();
    if (redis) {
      if (exactKey) {
        await redis.del(exactKey);
      } else {
        // Scan for all keys belonging to this user and delete them atomically.
        const keys = await redis.keys(`${userPrefix}*`);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      }
      return;
    }
  } catch (err) {
    console.warn("[entitlementCache] Redis del error:", err.message);
  }
  // Fallback
  _ipDel(exactKey ?? userPrefix);
}

/**
 * Expose the in-process map for unit tests.
 * Not part of the public API — do NOT import in production code.
 * @internal
 */
export { _inProcess as _testInProcessCache };
