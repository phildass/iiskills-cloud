import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import { getEffectivePricingBreakdown, formatINR } from '../../utils/pricing';

const COURSE_LABELS = {
  'learn-ai': 'Learn AI',
  'learn-developer': 'Learn Developer',
  'learn-management': 'Learn Management',
  'learn-pr': 'Learn PR',
};

/**
 * /payments/iiskills — IIS Skills Razorpay Checkout
 *
 * Accepts query params:
 *   - course  : app-id of the course being purchased (e.g. "learn-ai")
 *
 * Flow:
 *   1. User fills Name + Phone (Course + Amount are pre-filled / read-only).
 *   2. On submit, a Razorpay order is created server-side via
 *      POST /api/payments/iiskills/create-order.
 *   3. Razorpay JS SDK opens the checkout modal.
 *   4. On success the user is redirected to /otp-gateway to verify their OTP
 *      and activate paid access.
 *
 * Route: /payments/iiskills
 */
export default function IiskillsCheckout() {
  const router = useRouter();
  const { course } = router.query;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pricing = getEffectivePricingBreakdown();
  const courseLabel = COURSE_LABELS[course] || course || 'iiskills Course';

  // Ensure Razorpay script is available before attempting checkout
  const [razorpayReady, setRazorpayReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      setRazorpayReady(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);

    try {
      // Step 1 — Create order server-side
      const orderRes = await fetch('/api/payments/iiskills/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course: course || 'iiskills',
          name: trimmedName,
          phone: trimmedPhone,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.order?.id) {
        setError(orderData.error || 'Failed to create payment order. Please try again.');
        setLoading(false);
        return;
      }

      // Step 2 — Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'iiskills.cloud',
        description: `Enrollment: ${courseLabel}`,
        order_id: orderData.order.id,
        prefill: {
          name: trimmedName,
          contact: trimmedPhone,
        },
        notes: {
          app_id: course || 'iiskills',
          buyer_name: trimmedName,
        },
        theme: { color: '#2563EB' },
        handler: function (response) {
          // Step 3 — Payment succeeded; redirect user to OTP gateway
          const params = new URLSearchParams({
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            app_id: course || 'iiskills',
          });
          router.push(`/otp-gateway?${params.toString()}`);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(
          response.error?.description || 'Payment failed. Please try again.'
        );
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error('[iiskills checkout] Error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Checkout — iiskills.cloud</title>
        <meta
          name="description"
          content={`Enroll in ${courseLabel} on iiskills.cloud`}
        />
      </Head>

      {/* Load Razorpay checkout script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setRazorpayReady(true)}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-block bg-blue-100 text-blue-700 font-bold text-sm px-4 py-1 rounded-full mb-3">
              iiskills.cloud Enrollment
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Complete Your Enrollment
            </h1>
          </div>

          {/* Course + Pricing summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-700">
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Course</span>
              <span className="font-semibold text-gray-900">{courseLabel}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Base price</span>
              <span>{formatINR(pricing.basePrice)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">GST (18%)</span>
              <span>{formatINR(pricing.gstAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2 font-bold text-gray-900 text-base">
              <span>Total</span>
              <span>{formatINR(pricing.totalPrice)}</span>
            </div>
            {pricing.isIntroductory && (
              <p className="text-xs text-green-600 mt-2 text-center">
                🎉 Introductory price — valid till 31 March 2026
              </p>
            )}
          </div>

          {/* Checkout form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit Indian mobile number"
                required
                maxLength={10}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your OTP to activate access will be sent to this number.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !razorpayReady}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition-colors text-base"
            >
              {loading ? 'Opening checkout…' : `Pay ${formatINR(pricing.totalPrice)}`}
            </button>
          </form>

          <p className="text-xs text-center text-gray-400 mt-4">
            Secured by Razorpay · 256-bit SSL encryption
          </p>
        </div>
      </div>
    </>
  );
}
