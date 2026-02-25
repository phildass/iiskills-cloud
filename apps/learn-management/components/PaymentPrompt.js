import { getEffectivePricingBreakdown, formatINR } from "@iiskills/ui/pricing";

export default function PaymentPrompt({ onProceed, onCancel }) {
  const pricing = getEffectivePricingBreakdown();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Complete Your Registration</h2>
        
        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-xl font-semibold text-blue-900">Only {formatINR(pricing.base)}</p>
            <p className="text-gray-700 text-sm">{pricing.messages[0]}</p>
          </div>

          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100 comprehensive lessons</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Certificate upon completion</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Lifetime access to materials</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-4">
          <button onClick={onCancel} className="flex-1 btn-secondary">
            Cancel
          </button>
          <button onClick={onProceed} className="flex-1 btn-primary">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
