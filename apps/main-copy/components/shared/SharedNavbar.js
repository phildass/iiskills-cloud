import { Header } from "@iiskills/ui/common";

/**
 * Shared Navigation Bar Component
 *
 * This component wraps the shared Header from @iiskills/ui package.
 * It's maintained for backward compatibility with existing apps.
 *
 * Props:
 * - user: Current user object (null if not logged in)
 * - onLogout: Callback function to handle logout
 * - appName: Name of the current app (e.g., 'iiskills.cloud', 'Learn Your Aptitude')
 * - homeUrl: URL for the home link (default: '/')
 * - showAuthButtons: Whether to show login/register buttons (default: true)
 * - customLinks: Array of navigation links
 */
export default function SharedNavbar(props) {
  // Simply pass through all props to the shared Header component
  return <Header {...props} />;
}
