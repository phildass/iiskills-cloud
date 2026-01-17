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
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    
    // Validate environment variable
    if (!siteKey) {
      console.error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set");
      setMessage({
        type: "error",
        text: "reCAPTCHA is not configured. Please contact the administrator.",
      });
      return;
    }

    // Check if script is already loaded
    if (typeof window !== "undefined") {
      const existingScript = document.querySelector(
        `script[src*="recaptcha/api.js"]`
      );

      if (existingScript) {
        // Script already exists, wait for it to be ready
        if (window.grecaptcha && window.grecaptcha.ready) {
          window.grecaptcha.ready(() => {
            setRecaptchaLoaded(true);
          });
        } else {
          // Script is loading, wait for onload
          existingScript.addEventListener("load", () => {
            if (window.grecaptcha && window.grecaptcha.ready) {
              window.grecaptcha.ready(() => {
                setRecaptchaLoaded(true);
              });
            }
          });
        }
      } else {
        // Load the script
        const script = document.createElement("script");
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.grecaptcha && window.grecaptcha.ready) {
            window.grecaptcha.ready(() => {
              setRecaptchaLoaded(true);
            });
          }
        };
        script.onerror = () => {
          console.error("Failed to load reCAPTCHA script");
          setMessage({
            type: "error",
            text: "Failed to load reCAPTCHA. Please check your internet connection and try again.",
          });
        };
        document.body.appendChild(script);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      // Validate reCAPTCHA is loaded
      if (!recaptchaLoaded || !window.grecaptcha || !window.grecaptcha.ready) {
        throw new Error("reCAPTCHA not loaded. Please refresh the page and try again.");
      }

      // Get environment variable
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        throw new Error("reCAPTCHA is not configured properly.");
      }

      // Get reCAPTCHA token with ready() callback to ensure it's initialized
      const token = await new Promise((resolve, reject) => {
        window.grecaptcha.ready(async () => {
          try {
            const token = await window.grecaptcha.execute(siteKey, {
              action: "newsletter_signup",
            });
            resolve(token);
          } catch (error) {
            reject(new Error("Failed to get reCAPTCHA token. Please try again."));
          }
        });
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
        text: "🎉 Thank you for subscribing! You'll only receive emails about new courses and important updates—no spam, we promise!",
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
    <div className={mode === "modal" ? "p-6" : "p-8"}>
      <div className="text-center mb-6">
        <h2
          className={`font-bold ${mode === "modal" ? "text-2xl" : "text-3xl"} text-gray-800 mb-3`}
        >
          📧 Subscribe to The Skilling Newsletter
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-2">
          Stay informed about what matters most to your learning journey.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
          <p className="text-sm text-blue-900 font-medium">
            ✉️ <strong>Our Promise:</strong>
          </p>
          <p className="text-xs text-blue-800 mt-1">
            The Skilling Newsletter will be sent ONLY when new courses are introduced, or important announcements/changes are made. You will NOT receive unnecessary or frequent emails.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
          />
        </div>

        {message.text && (
          <div
            className={`p-3 rounded-lg text-sm ${
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
          className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe Now"}
        </button>

        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>
            By subscribing, you agree to our{" "}
            <a
              href="/privacy"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="/terms"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>
            .
          </p>
          <p className="text-xs text-gray-400 mt-2">
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
  );

  if (mode === "modal") {
    return (
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${isClosing ? "animate-fade-out" : "animate-fade-in"}`}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-slide-up">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
