import { useState, useEffect } from "react";
import { useRouter } from "next/router";

/**
 * NewsletterSignup Component
 *
 * A reusable newsletter signup component with two modes:
 * - Modal: Popup overlay that appears on initial visit or at intervals
 * - Embedded: Inline form for dedicated newsletter page
 *
 * Props:
 * - mode: 'modal' | 'embedded' (default: 'embedded')
 * - onClose: Callback function when modal is closed (modal mode only)
 * - onSuccess: Callback function when subscription is successful
 * - isClosing: Boolean flag to trigger fade-out animation (modal mode only)
 */
export default function NewsletterSignup({
  mode = "embedded",
  onClose = null,
  onSuccess = null,
  isClosing = false,
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  // Load reCAPTCHA script
  useEffect(() => {
    if (typeof window !== "undefined" && !window.grecaptcha) {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => setRecaptchaLoaded(true);
      document.body.appendChild(script);
    } else if (window.grecaptcha) {
      setRecaptchaLoaded(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      // Get reCAPTCHA token
      if (!recaptchaLoaded || !window.grecaptcha) {
        throw new Error("reCAPTCHA not loaded. Please try again.");
      }

      const token = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
        action: "newsletter_signup",
      });

      // Submit to API
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, recaptchaToken: token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Subscription failed");
      }

      setMessage({
        type: "success",
        text: "Thank you for subscribing! Please check your email to confirm.",
      });
      setEmail("");

      if (onSuccess) {
        onSuccess();
      }

      // Auto-close modal after success (if in modal mode)
      if (mode === "modal" && onClose) {
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <div className={mode === "modal" ? "p-5" : "p-8"}>
      <div className="mb-4">
        <h2 className={`font-bold ${mode === "modal" ? "text-lg" : "text-3xl"} text-gray-800 mb-2`}>
          📧 Stay Updated!
        </h2>
        <p className="text-gray-600 text-xs md:text-sm">
          Get the latest updates and exclusive content.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            className={`w-full ${mode === "modal" ? "px-3 py-2 text-sm" : "px-4 py-3"} border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition`}
          />
        </div>

        {message.text && (
          <div
            className={`p-2 rounded-lg text-xs ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-primary hover:bg-blue-700 text-white font-bold ${mode === "modal" ? "py-2 px-4 text-sm" : "py-3 px-6"} rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>

        <div className="text-xs text-gray-500 space-y-1">
          <p className="text-center">
            By subscribing, you agree to our{" "}
            <a
              href="/privacy"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </form>
    </div>
  );

  if (mode === "modal") {
    return (
      <div
        className={`fixed bottom-6 right-6 z-50 max-w-sm w-full mx-4 sm:mx-0 ${isClosing ? "animate-slide-out-right" : "animate-slide-in-right"}`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-primary relative overflow-hidden">
          {/* Accent bar at top */}
          <div className="h-1 bg-gradient-to-r from-primary to-accent"></div>

          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          {formContent}
        </div>
      </div>
    );
  }

  return <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg">{formContent}</div>;
}
