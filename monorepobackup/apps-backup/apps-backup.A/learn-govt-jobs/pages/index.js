import { useState, useEffect } from 'react';
import LandingPage from '../components/LandingPage';

export default function Home() {
  const [user, setUser] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [stats, setStats] = useState({
    newToday: 1240,
    totalActive: 98450,
    deadlinesThisWeek: 145,
    successfulUsers: 12500
  });
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    // This would normally check Supabase auth or session
    const checkAuth = async () => {
      // Mock implementation - replace with actual auth check
      const isLoggedIn = false; // supabase.auth.getUser()
      if (isLoggedIn) {
        // Fetch user data and matched jobs
        // setUser(userData);
        // setMatchedJobs(await fetchMatchedJobs());
      }
    };

    // Fetch recent jobs
    const fetchJobs = async () => {
      // Mock implementation - replace with actual API call
      // const jobs = await fetch('/api/jobs/recent').then(r => r.json());
      // setRecentJobs(jobs);
    };

    checkAuth();
    fetchJobs();

    // Show paywall after user has viewed some jobs (if not subscribed)
    const paywallTimer = setTimeout(() => {
      if (!user?.subscribed) {
        setShowPaywall(true);
      }
    }, 30000); // Show after 30 seconds

    return () => clearTimeout(paywallTimer);
  }, [user]);

  return (
    <LandingPage
      user={user}
      recentJobs={recentJobs}
      matchedJobs={matchedJobs}
      stats={stats}
      showPaywall={showPaywall}
    />
  );
}
