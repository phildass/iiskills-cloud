/**
 * Tests for the useEntitlement hook — specifically the fetchEntitlement()
 * utility that underpins the hook.
 *
 * Tests cover:
 *  - fetchEntitlement returns true when the API reports entitled=true
 *  - fetchEntitlement returns false when the API reports entitled=false
 *  - fetchEntitlement returns false on non-OK HTTP responses
 *  - fetchEntitlement rejects when fetch throws (hook catches this)
 *  - fetchEntitlement attaches the Authorization header when a session exists
 *  - fetchEntitlement does NOT attach header when session is null
 *  - fetchEntitlement calls correct API URL including appId query param
 *  - fetchEntitlement URL-encodes the appId
 *  - isFreeAccessEnabled() short-circuit is respected (verified via freeAccess)
 */

'use strict';

// We import the real fetchEntitlement with injected deps for direct testing.
const { fetchEntitlement } = require('../lib/hooks/useEntitlement');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a mock fetch that returns the given JSON body. */
function makeFetch({ ok = true, body = {} } = {}) {
  return jest.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(body),
  });
}

/** Build a mock getSession returning the given access token (or null). */
function makeGetSession(accessToken = null) {
  return jest.fn().mockResolvedValue({
    data: { session: accessToken ? { access_token: accessToken } : null },
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('fetchEntitlement — core entitlement fetch logic', () => {
  it('returns true when API reports entitled=true', async () => {
    const result = await fetchEntitlement('learn-ai', {
      getSession: makeGetSession(),
      fetchImpl: makeFetch({ ok: true, body: { entitled: true } }),
    });
    expect(result).toBe(true);
  });

  it('returns false when API reports entitled=false', async () => {
    const result = await fetchEntitlement('learn-ai', {
      getSession: makeGetSession(),
      fetchImpl: makeFetch({ ok: true, body: { entitled: false } }),
    });
    expect(result).toBe(false);
  });

  it('returns false on non-OK HTTP status', async () => {
    const result = await fetchEntitlement('learn-management', {
      getSession: makeGetSession(),
      fetchImpl: makeFetch({ ok: false, body: {} }),
    });
    expect(result).toBe(false);
  });

  it('rejects when fetch throws a network error (hook catches this)', async () => {
    const fetchImpl = jest.fn().mockRejectedValue(new Error('network failure'));
    await expect(
      fetchEntitlement('learn-pr', { getSession: makeGetSession(), fetchImpl })
    ).rejects.toThrow('network failure');
  });

  it('attaches Authorization header when session has access_token', async () => {
    const fetchImpl = makeFetch({ ok: true, body: { entitled: true } });
    await fetchEntitlement('learn-developer', {
      getSession: makeGetSession('test-token-abc'),
      fetchImpl,
    });

    const [, callOptions] = fetchImpl.mock.calls[0];
    expect(callOptions.headers['Authorization']).toBe('Bearer test-token-abc');
  });

  it('does NOT attach Authorization header when session is null', async () => {
    const fetchImpl = makeFetch({ ok: true, body: { entitled: false } });
    await fetchEntitlement('learn-ai', {
      getSession: makeGetSession(null),
      fetchImpl,
    });

    const [, callOptions] = fetchImpl.mock.calls[0];
    expect(callOptions.headers['Authorization']).toBeUndefined();
  });

  it('calls the correct API endpoint including appId', async () => {
    const fetchImpl = makeFetch({ ok: true, body: { entitled: true } });
    await fetchEntitlement('learn-management', {
      getSession: makeGetSession(),
      fetchImpl,
    });

    const [url] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://iiskills.cloud/api/entitlement?appId=learn-management');
  });

  it('URL-encodes special characters in appId', async () => {
    const fetchImpl = makeFetch({ ok: true, body: { entitled: false } });
    await fetchEntitlement('app id with spaces', {
      getSession: makeGetSession(),
      fetchImpl,
    });

    const [url] = fetchImpl.mock.calls[0];
    expect(url).toContain('app%20id%20with%20spaces');
  });
});

// ---------------------------------------------------------------------------
// isFreeAccessEnabled — short-circuit behaviour (reuses freeAccess module)
// ---------------------------------------------------------------------------

describe('useEntitlement — free-access mode short-circuit', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('isFreeAccessEnabled returns true when FREE_ACCESS=true', () => {
    process.env.FREE_ACCESS = 'true';
    const { isFreeAccessEnabled } = require('../lib/freeAccess');
    expect(isFreeAccessEnabled()).toBe(true);
  });

  it('isFreeAccessEnabled returns false when neither flag is set', () => {
    delete process.env.FREE_ACCESS;
    delete process.env.NEXT_PUBLIC_FREE_ACCESS;
    const { isFreeAccessEnabled } = require('../lib/freeAccess');
    expect(isFreeAccessEnabled()).toBe(false);
  });
});
