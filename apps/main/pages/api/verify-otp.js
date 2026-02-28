import { createClient } from '@supabase/supabase-js';
import { verifyOTP, sendWelcomeEmail } from '@lib/otpService';
import { APPS } from '@lib/appRegistry';

/**
 * OTP Verification Endpoint
 *
 * Verifies a 6-digit OTP issued after payment (via ai-enter callback) or by admin.
 *
 * On success the endpoint also attempts to grant a paid entitlement to the
 * authenticated user (identified by email).  This makes the upgrade fully
 * self-serve: verify OTP → immediately become a PAID Learner.
 *
 * Usage:
 *   POST /api/verify-otp
 *   Body: { email, otp, appId }
 *
 * Returns:
 *   { success, message, appId, email, entitlementGranted }
 */

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, otp, appId, paymentTransactionId } = req.body;

    // Validate required fields
    if (!email || !otp || !appId) {
      return res.status(400).json({
        success: false,
        error: 'Email, OTP, and appId are required',
      });
    }

    // Verify OTP
    const result = await verifyOTP({ email, otp, appId, paymentTransactionId });

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    // ── Grant entitlement ────────────────────────────────────────────────────
    let entitlementGranted = false;

    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        // Find user by email (service-role bypasses RLS)
        const { data: users, error: lookupErr } = await supabase
          .from('auth.users')
          .select('id')
          .eq('email', email)
          .limit(1);

        // auth.users is not directly queryable via PostgREST in most setups;
        // fall back to the admin auth API
        let userId = users?.[0]?.id;
        if (!userId || lookupErr) {
          const { data: authData } = await supabase.auth.admin.listUsers();
          const match = authData?.users?.find(
            (u) => u.email?.toLowerCase() === email.toLowerCase()
          );
          userId = match?.id;
        }

        if (userId) {
          const { error: entErr } = await supabase.from('entitlements').insert([
            {
              user_id: userId,
              app_id: appId,
              status: 'active',
              source: 'razorpay',
              expires_at: new Date(
                Date.now() + 365 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
          ]);

          if (entErr) {
            // Ignore duplicate entitlement (idempotent)
            if (
              entErr.code !== '23505' &&
              !entErr.message?.includes('duplicate') &&
              !entErr.message?.includes('unique')
            ) {
              console.error('[verify-otp] Failed to insert entitlement:', entErr);
            } else {
              entitlementGranted = true; // already granted
            }
          } else {
            entitlementGranted = true;
            console.log(
              `[verify-otp] Entitlement granted: user=${userId} app=${appId}`
            );

            // Send welcome email on first-time grant
            const appConfig = APPS[appId];
            if (appConfig) {
              sendWelcomeEmail({
                email: email.toLowerCase().trim(),
                appId,
                appName: appConfig.name,
              }).catch((err) =>
                console.error('[verify-otp] Welcome email error:', err)
              );
            }
          }
        } else {
          console.warn(
            `[verify-otp] No registered user found for email ${email}; entitlement skipped`
          );
        }
      } catch (entGrantErr) {
        // Non-fatal – OTP was still valid
        console.error('[verify-otp] Entitlement grant error:', entGrantErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      appId: result.appId,
      email: result.email,
      entitlementGranted,
    });
  } catch (error) {
    console.error('[verify-otp] endpoint error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred during verification',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}