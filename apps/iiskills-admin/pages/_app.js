import "../styles/globals.css";
import ErrorBoundary from "../components/ErrorBoundary";

export default function App({ Component, pageProps }) {
  // Check if we're using local content mode
  const useLocalContent = process.env.NEXT_PUBLIC_USE_LOCAL_CONTENT === "true";
  const supabaseSuspended = process.env.NEXT_PUBLIC_SUPABASE_SUSPENDED === "true";
  
  // Determine display mode
  const isLocalOnlyMode = useLocalContent || supabaseSuspended;
  
  return (
    <ErrorBoundary>
      {/* Warning banner - only show if in local-only mode */}
      {isLocalOnlyMode && (
        <div className="admin-warning-banner bg-yellow-600 text-white py-3 px-4 text-center sticky top-0 z-50">
          <div className="admin-warning-banner-text">
            ⚠️ LIMITED MODE - LOCAL DATA ONLY ⚠️
            <span className="ml-4 text-sm font-normal opacity-90">
              Supabase is disabled. Showing local test data only.
            </span>
          </div>
        </div>
      )}
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
