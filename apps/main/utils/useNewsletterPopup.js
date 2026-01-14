import { useState, useEffect } from "react";
import { getCurrentUser } from "../lib/supabaseClient";

/**
 * Hook to manage newsletter popup display
 * Shows popup only once per session for unauthenticated users and auto-dismisses after 10 seconds
 *
 * @param {number} displayDurationSeconds - Duration to show popup (default: 10)
 * @returns {object} - { showPopup, closePopup, isClosing }
 */
export function useNewsletterPopup(displayDurationSeconds = 10) {
  const [showPopup, setShowPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const STORAGE_KEY = "iiskills_newsletter_popup";
  const SESSION_KEY = "iiskills_newsletter_session_shown";

  useEffect(() => {
    if (typeof window === "undefined") return;

    let showTimer;
    let autoDismissTimer;

    const checkAuthAndShowPopup = async () => {
      try {
        // Check if already shown in this session
        const sessionShown = sessionStorage.getItem(SESSION_KEY);
        if (sessionShown) {
          return;
        }

        // Check if user is authenticated
        const user = await getCurrentUser();
        
        // Don't show popup to authenticated users
        if (user) {
          return;
        }

        // Check localStorage for subscription status
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const { subscribed } = JSON.parse(storedData);
          // Don't show if user already subscribed
          if (subscribed) {
            return;
          }
        }

        // Mark as shown in this session
        sessionStorage.setItem(SESSION_KEY, "true");

        // Show popup to unauthenticated users after a short delay
        showTimer = setTimeout(() => setShowPopup(true), 2000);

        // Auto-dismiss after specified duration
        autoDismissTimer = setTimeout(() => {
          handleAutoDismiss();
        }, (displayDurationSeconds + 2) * 1000);
      } catch (error) {
        console.error("Error checking authentication for popup:", error);
        // On error, don't show popup to be safe
      }
    };

    checkAuthAndShowPopup();

    return () => {
      if (showTimer) clearTimeout(showTimer);
      if (autoDismissTimer) clearTimeout(autoDismissTimer);
    };
  }, [displayDurationSeconds]);

  const handleAutoDismiss = () => {
    setIsClosing(true);
    // Wait for fade-out animation before hiding
    setTimeout(() => {
      setShowPopup(false);
      setIsClosing(false);
    }, 300);
  };

  const closePopup = (subscribed = false) => {
    setIsClosing(true);
    
    // Wait for fade-out animation before hiding
    setTimeout(() => {
      setShowPopup(false);
      setIsClosing(false);
    }, 300);

    try {
      const data = {
        lastShown: new Date().toISOString(),
        subscribed: subscribed,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving popup state:", error);
    }
  };

  return { showPopup, closePopup, isClosing };
}
