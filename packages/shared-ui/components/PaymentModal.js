"use client";

/**
 * PaymentModal
 *
 * Renders a payment / upsell modal overlay.  Returns null immediately when
 * the `iiskills_admin_bypass=true` cookie is present so that authorised
 * testers and product owners never see the paywall.
 *
 * When the modal opens and a Supabase session is present, `full_name` and
 * `phone` are fetched from the user's profile row and pre-filled in the form
 * fields so the user doesn't have to re-type information already on record.
 * Both fields remain editable.  The current values are passed as
 * `{ fullName, phone }` to the `onProceed` callback.
 */

import { useState, useEffect } from "react";
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
 *                                       Receives `{ fullName, phone }`.
 * @param {React.ReactNode} [props.children] - Optional custom body content.
 */
export default function PaymentModal({ isOpen, onClose, onProceed, children }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Load profile data when the modal opens so fields are pre-filled.
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    async function loadProfile() {
      setProfileLoading(true);
      try {
        // Dynamic import keeps this safe on apps where supabaseClient may be a
        // mock (missing credentials in CI / local dev without env vars).
        const { getCurrentUser, supabase } = await import("@lib/supabaseClient");
        const user = await getCurrentUser();
        if (!user || cancelled) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, first_name, last_name, phone")
          .eq("id", user.id)
          .maybeSingle();

        if (!cancelled && profile) {
          const name =
            profile.full_name || [profile.first_name, profile.last_name].filter(Boolean).join(" ");
          if (name) setFullName(name);

          if (profile.phone) {
            // Display stored phone stripped of +91 prefix for the 10-digit input.
            const stored = profile.phone;
            const local =
              stored.startsWith("+91") && stored.length === 13 ? stored.slice(3) : stored;
            setPhone(local);
          }
        }
      } catch {
        // Autofill is best-effort — silently degrade if Supabase is unavailable.
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Global admin override — never show the paywall to bypass-cookie holders.
  if (isAdminBypass()) return null;

  if (!isOpen) return null;

  const handleProceed = () => {
    if (onProceed) onProceed({ fullName: fullName.trim(), phone: phone.trim() });
  };

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

        {/* Pre-filled profile fields — autofilled from Supabase, editable by user */}
        <div className="space-y-3 mb-6">
          <div>
            <label htmlFor="pm-fullname" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="pm-fullname"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={profileLoading ? "Loading…" : "Your full name"}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="pm-phone" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm select-none">
                +91
              </span>
              <input
                id="pm-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={profileLoading ? "Loading…" : "9876543210"}
                maxLength={10}
                className="w-full border border-gray-300 rounded-r-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="tel-national"
                inputMode="numeric"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          {onProceed && (
            <button
              onClick={handleProceed}
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
