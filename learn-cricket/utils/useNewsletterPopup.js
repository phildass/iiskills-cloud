import { useState, useEffect } from "react";
import { getCurrentUser } from "../lib/supabaseClient";

/**
 * Hook to manage newsletter popup display
 * Shows popup on page load for unauthenticated users only and auto-dismisses after 30 seconds
 *
 * @param {number} displayDurationSeconds - Duration to show popup (default: 30)
 * @returns {object} - { showPopup, closePopup, isClosing }
 */
export function useNewsletterPopup(displayDurationSeconds = 30) {
  const [showPopup, setShowPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const STORAGE_KEY = "iiskills_newsletter_popup";

  useEffect(() => {
    if (typeof window === "undefined") return;

    let showTimer;
    let autoDismissTimer;

    const checkAuthAndShowPopup = async () => {
      try {
        // Check if user is authenticated
        const user = await getCurrentUser();
        
        // Don't show popup to authenticated users
        if (user) {
          return;
        }

        // Show popup to unauthenticated users
        showTimer = setTimeout(() => setShowPopup(true), 100);

        // Auto-dismiss after specified duration
        autoDismissTimer = setTimeout(() => {
          handleAutoDismiss();
        }, (displayDurationSeconds + 0.1) * 1000); // Add 0.1s for show animation
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
