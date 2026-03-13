/**
 * TestSiteModal Component
 *
 * A modal overlay shown when a visitor attempts any action on the test site.
 * Displayed via the global click interceptor in _app.js.
 *
 * Props:
 *   onClose — callback to dismiss the modal
 */

export default function TestSiteModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="test-site-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 px-6 py-4 flex items-center gap-3">
          <svg
            className="w-7 h-7 text-white flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <h2 id="test-site-modal-title" className="text-white text-lg font-bold">
            Test Site Only
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-3">
          <p className="text-gray-800 text-base font-semibold">
            No actions allowed on this site.
          </p>
          <p className="text-gray-600 text-sm">
            This is a <strong>read-only demo copy</strong> of the iiskills platform. All
            navigation and content is available for viewing, but enrolling, paying, registering,
            logging in, and all other actions are disabled.
          </p>
          <p className="text-gray-500 text-xs italic">
            To perform real actions, please visit{" "}
            <a
              href="https://iiskills.cloud"
              className="text-blue-600 underline"
              target="_blank"
              rel="noreferrer"
            >
              iiskills.cloud
            </a>
            .
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-400"
            autoFocus
          >
            OK, Got it
          </button>
        </div>
      </div>
    </div>
  );
}
