import { generateAccessCode } from '../../../lib/accessCode';
import { createClient } from '@supabase/supabase-js';
import { 
  grantBundleAccess, 
  updatePaymentBundleInfo,
  getAppsToUnlock,
  getBundleInfo,
} from '../../../../../packages/access-control';

// Initialize Supabase client with service role for server-side operations
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY - payment confirmation requires service role privileges');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transactionId, email, amount, userId } = req.body;

    if (!transactionId || !email || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify payment (in production, verify with payment gateway)
    const paymentVerified = true; // TODO: Implement actual payment gateway verification

    if (!paymentVerified) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }
    
    const supabase = getSupabaseClient();
    const appId = 'learn-management';
    
    // Get all apps that should be unlocked (bundle logic)
    const appsToUnlock = getAppsToUnlock(appId);
    const bundleInfo = getBundleInfo(appId);
    
    // Generate access code for backwards compatibility
    const accessCode = generateAccessCode();

    // Store payment record with bundle information
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        payment_id: transactionId,
        payment_gateway: 'razorpay',
        app_id: appId,
        user_email: email,
        user_id: userId || null,
        amount: amount,
        currency: 'INR',
        status: 'captured',
        bundle_apps: appsToUnlock, // Store all apps unlocked by this payment
        payment_notes: { access_code: accessCode },
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment record creation error:', paymentError);
      throw paymentError;
    }
    
    // Grant access to all apps in bundle (if user is authenticated)
    if (userId) {
      const result = await grantBundleAccess({
        userId,
        purchasedAppId: appId,
        paymentId: payment.id,
      });
      
      // Update payment record with complete bundle information
      await updatePaymentBundleInfo(payment.id, result.bundledApps);
      
      console.log(`✅ Bundle access granted to user ${userId}:`, result.bundledApps);
    }

    // Legacy: Store in registrations table for access code support
    await supabase
      .from('registrations')
      .insert({
        email,
        access_code: accessCode,
        transaction_id: transactionId,
        amount,
        status: 'active'
      });

    // Send email with access code (in production, use SendGrid API)
    if (process.env.SENDGRID_API_KEY) {
      // TODO: Implement SendGrid email with bundle information
      console.log(`Sending access code ${accessCode} to ${email}`);
      console.log(`Bundle unlocked: ${appsToUnlock.join(', ')}`);
    }

    return res.status(200).json({
      success: true,
      access_code: accessCode,
      apps_unlocked: appsToUnlock,
      message: bundleInfo 
        ? `🎉 ${bundleInfo.highlight} You now have access to ${appsToUnlock.join(' AND ')}!`
        : `Payment confirmed! You now have access to ${appId}.`,
      bundle_info: bundleInfo ? {
        id: bundleInfo.id,
        name: bundleInfo.name,
        apps: appsToUnlock,
        description: bundleInfo.description,
        features: bundleInfo.features,
      } : null,
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
