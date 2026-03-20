/**
 * PaymentModal
 *
 * Renders a payment / upsell modal overlay.  Returns null immediately when
 * the `iiskills_admin_bypass=true` cookie is present so that authorised
 * testers and product owners never see the paywall.
 */

import { hasBypassCookieFromString } from "@iiskills/access-control/src";

/**
 * Returns `true` when the admin bypass cookie is active in the current browser
 * session.  Safe to call during render — reads `document.cookie` synchronously.
 *
 * @returns {boolean}
 */
export function isAdminBypass() {
  if (typeof document === "undefined") return false;
  return hasBypassCookieFromString(document.cookie);
}

/**
 * @param {Object}   props
 * @param {boolean}  props.isOpen      - Whether the modal should be visible.
 * @param {Function} props.onClose     - Callback to dismiss the modal.
 * @param {Function} [props.onProceed] - Callback when the user taps "Pay now".
 * @param {React.ReactNode} [props.children] - Optional custom body content.
 */
export default function PaymentModal({ isOpen, onClose, onProceed, children }) {
  // Global admin override — never show the paywall to bypass-cookie holders.
  if (isAdminBypass()) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        {children ?? (
          <>
            <h2 className="text-2xl font-bold mb-4">Unlock Full Access</h2>
            <p className="text-gray-600 mb-6">
              Purchase a subscription to access all lessons and features.
            </p>
          </>
        )}

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          {onProceed && (
            <button
              onClick={onProceed}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Pay now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
