import React from "react";
import Link from "next/link";

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 *
 * Features:
 * - Catches and logs runtime errors
 * - Displays user-friendly error message
 * - Provides reset functionality
 * - Shows error details in development
 * - Prevents entire app from crashing
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // Store error details in state
    this.setState({
      error,
      errorInfo,
    });

    // In production, you would send this to an error reporting service
    // Example: logErrorToService(error, errorInfo)
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 border-2 border-red-200">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
            </div>

            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
              <p className="text-lg text-gray-800 leading-relaxed mb-4">
                We're sorry, but something unexpected happened. Our team has been notified and we're
                working to fix it.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="mt-4 p-4 bg-white rounded border border-red-200 overflow-auto">
                  <p className="font-bold text-red-700 mb-2">Error Details (Development Only):</p>
                  <p className="text-sm text-gray-700 font-mono mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                        Stack Trace
                      </summary>
                      <pre className="text-xs mt-2 p-2 bg-gray-50 rounded overflow-auto max-h-64">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={this.resetError}
                className="block w-full bg-primary text-white px-6 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-blue-700 transition"
              >
                Try Again
              </button>

              <Link
                href="/"
                className="block w-full bg-charcoal text-white px-6 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-gray-700 transition text-center"
              >
                Go to Home Page
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                If this problem persists, please{" "}
                <a href="mailto:support@iiskills.cloud" className="text-primary hover:underline">
                  contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
