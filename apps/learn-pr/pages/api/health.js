/**
 * Health endpoint for learn-pr.
 *
 * Returns 200 if the app is running and required environment variables are
 * present.  Deliberately does NOT check database connectivity so that the
 * health check passes even when Supabase is unreachable.
 *
 * GET /api/health
 */
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    return res.status(503).json({
      status: 'error',
      app: 'learn-pr',
      message: 'Missing required environment variables',
      missing,
    });
  }

  return res.status(200).json({
    status: 'ok',
    app: 'learn-pr',
    timestamp: new Date().toISOString(),
  });
}
