import { useState } from "react";
import Head from "next/head";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setEmail("");
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Coming Soon - Revolutionary Education Apps | iiskills.cloud</title>
        <meta
          name="description"
          content="Coming Soon Apps that will revolutionise education like never before! Stay tuned for groundbreaking educational apps from iiskills.cloud."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
      </Head>

      {/* Background Layer - Gradient with subtle pattern */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #1e40af 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 15s ease infinite',
        }}
      >
        {/* Overlay pattern for depth */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Overlay Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full text-center">
          {/* Main Message Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 mb-8 transform hover:scale-105 transition-transform duration-300">
            {/* Animated Icon */}
            <div className="mb-8">
              <div className="inline-block animate-bounce">
                <svg
                  className="w-24 h-24 mx-auto text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              Coming Soon Apps
            </h1>

            {/* Subheading */}
            <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-accent mb-8 leading-relaxed">
              that will revolutionise education like never before!
            </p>

            {/* Description */}
            <p className="text-lg md:text-xl text-charcoal mb-8 max-w-2xl mx-auto">
              We're working on something extraordinary. Get ready for cutting-edge educational
              apps that will transform the way you learn and grow.
            </p>

            {/* Email Notification Form */}
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none text-charcoal"
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isSubmitting ? "Submitting..." : "Notify Me"}
                  </button>
                </div>

                {submitStatus === "success" && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    ✓ Thank you! We'll notify you when we launch.
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    ⚠ Something went wrong. Please try again.
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <p className="text-sm md:text-base text-charcoal">
              <span className="font-semibold">iiskills.cloud</span> - Indian Institute of
              Professional Skills Development
              <br />
              <span className="text-gray-600">Building the future of education</span>
            </p>
          </div>
        </div>
      </main>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
