/**
 * GET /api/admin/setup/check
 * 
 * Check if admin setup mode is available
 * 
 * Returns:
 * - setupEnabled: boolean
 * - message: string
 */

// Simple in-memory check (use database in production)
let adminExists = false;

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if ADMIN_SETUP_MODE is enabled
  const setupModeEnabled = process.env.ADMIN_SETUP_MODE === 'true';

  // Check if admin exists (in-memory for MVP, use database in production)
  const hasAdmin = adminExists;

  if (!setupModeEnabled) {
    return res.status(200).json({
      setupEnabled: false,
      message: 'Admin setup mode is disabled. Set ADMIN_SETUP_MODE=true to enable.'
    });
  }

  if (hasAdmin) {
    return res.status(200).json({
      setupEnabled: false,
      message: 'An admin account already exists. Admin setup is no longer available.'
    });
  }

  return res.status(200).json({
    setupEnabled: true,
    message: 'Admin setup mode is enabled and ready for first-time setup.'
  });
}
