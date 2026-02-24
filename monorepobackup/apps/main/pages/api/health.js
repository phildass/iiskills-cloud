/**
 * Simple health check endpoint for deploy verification.
 *
 * GET /api/health
 *
 * Returns:
 *   200 — { ok: true, ts: "<ISO timestamp>" }
 *
 * Access: public — no authentication required.
 * Used by scripts/deploy-main-safe.sh to confirm the process came up
 * successfully after a PM2 restart.
 */

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  return res.status(200).json({ ok: true, ts: new Date().toISOString() });
}
