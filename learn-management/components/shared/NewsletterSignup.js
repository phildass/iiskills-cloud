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
    <div className={mode === "modal" ? "grid md:grid-cols-2 gap-0 max-h-[90vh] overflow-hidden" : "p-8"}>
      {/* Left Column - Form */}
      <div className={mode === "modal" ? "p-8 md:p-10 flex flex-col justify-center" : ""}>
        <div className="mb-8">
          <h2
            className={`font-bold ${mode === "modal" ? "text-3xl md:text-4xl" : "text-3xl"} text-gray-900 mb-4 leading-tight`}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Stay Inspired
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Subscribe to receive curated learning resources, insights, and exclusive updates directly to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide uppercase" style={{ letterSpacing: '0.05em' }}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-base bg-white"
            />
          </div>

          {message.text && (
            <div
              className={`p-4 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border-2 border-green-200"
                  : "bg-red-50 text-red-800 border-2 border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-semibold py-4 px-8 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe Now"}
          </button>

          <div className="text-xs text-gray-500 space-y-2 leading-relaxed">
            <p>
              By subscribing, you agree to our{" "}
              <a
                href="/privacy"
                className="text-primary hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="/terms"
                className="text-primary hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
              .
            </p>
            <p className="text-xs text-gray-400">
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="https://policies.google.com/privacy"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/terms"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>{" "}
              apply.
            </p>
          </div>
        </form>
      </div>

      {/* Right Column - Logo (Modal only) */}
      {mode === "modal" && (
        <div className="hidden md:flex bg-gradient-to-br from-primary/5 to-accent/5 items-center justify-center p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50"></div>
          <div className="relative z-10 text-center">
            <img 
              src="/images/iiskills-logo.png" 
              alt="iiskills.cloud" 
              className="w-full max-w-xs mx-auto mb-6 drop-shadow-2xl"
            />
            <p className="text-gray-600 text-sm italic mt-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              "Empowering minds, transforming futures"
            </p>
          </div>
        </div>
      )}
    </div>
  );

  if (mode === "modal") {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none ${isClosing ? "animate-fade-out" : "animate-fade-in"}`}
      >
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full relative animate-slide-up pointer-events-auto" style={{ boxShadow: '0 25px 80px rgba(0, 0, 0, 0.2)' }}>
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors bg-white rounded-full p-2 shadow-md hover:shadow-lg z-10"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
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
