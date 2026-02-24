"use client";

import { useEffect, useRef, useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const recaptchaReady = useRef(false);

  // Load reCAPTCHA v3 script
  useEffect(() => {
    if (typeof window !== "undefined" && !window.grecaptcha) {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        recaptchaReady.current = true;
      };
      document.body.appendChild(script);
    } else if (window.grecaptcha) {
      recaptchaReady.current = true;
    }
  }, []);

  // Function to get reCAPTCHA token
  async function getRecaptchaToken() {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha) {
        reject("reCAPTCHA not loaded. Please try again.");
        return;
      }
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: "submit" })
          .then(resolve)
          .catch(reject);
      });
    });
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      if (!recaptchaReady.current) {
        setError("reCAPTCHA not loaded. Please try again.");
        setLoading(false);
        return;
      }

      // Always get a new token
      const recaptchaToken = await getRecaptchaToken();

      // Submit to your API route (adjust the endpoint as needed)
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: recaptchaToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to subscribe.");
      } else {
        setError(""); // clear previous error
        setEmail("");
        alert("Subscription successful!"); // Or show a custom success message/UI
      }
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : "An error occurred. Please reload and try again."
      );
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <div>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
        />
      </div>
      {error && (
        <div style={{ color: "#b71c1c", marginBottom: 8 }}>
          {error}
        </div>
      )}
      <button
        type="submit"
        style={{
          background: "#0066ff",
          color: "#fff",
          padding: "0.75em 2em",
          border: "none",
          borderRadius: 5,
          cursor: loading ? "not-allowed" : "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Subscribe Now"}
      </button>
      <div style={{ fontSize: "0.8em", marginTop: 16, color: "#888" }}>
        This site is protected by reCAPTCHA and the Google{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
          Terms of Service
        </a>
        {" "}apply.
      </div>
    </form>
  );
}