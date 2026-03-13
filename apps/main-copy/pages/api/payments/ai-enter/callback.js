/**
 * DEPRECATED — ai-enter Payment Callback (Legacy Endpoint)
 *
 * This endpoint is no longer active.
 *
 * The canonical callback endpoint is:
 *   POST https://iiskills.cloud/api/payments/confirm
 *
 * Please update your aienter.in configuration to point to /api/payments/confirm
 * using the x-aienter-signature header and AIENTER_CONFIRMATION_SIGNING_SECRET.
 *
 * See docs/PAYMENT_INTEGRATION.md for the full specification.
 */
export default function handler(req, res) {
  res.setHeader("Link", '<https://iiskills.cloud/api/payments/confirm>; rel="successor-version"');
  return res.status(410).json({
    error: "This endpoint is deprecated. Use POST /api/payments/confirm instead.",
    successor: "https://iiskills.cloud/api/payments/confirm",
  });
}
