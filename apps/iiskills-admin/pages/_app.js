import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* Warning banner for local mode */}
      <div className="admin-warning-banner bg-red-600 text-white py-3 px-4 text-center sticky top-0 z-50">
        <div className="admin-warning-banner-text">
          ⚠️ LOCAL MODE - NOT FOR PRODUCTION ⚠️
          <span className="ml-4 text-sm font-normal opacity-90">
            This admin dashboard uses local test data (no authentication required)
          </span>
        </div>
      </div>
      <Component {...pageProps} />
    </>
  );
}
