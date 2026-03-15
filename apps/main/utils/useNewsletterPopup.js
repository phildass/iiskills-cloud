/**
 * Hook to manage newsletter popup display.
 *
 * Newsletter pop-ups have been removed as of March 2026.
 * Newsletter sign-up is now handled inline on the /newsletter page only.
 * This hook always returns showPopup=false and is retained for API compatibility.
 *
 * @returns {object} - { showPopup: false, closePopup: () => {}, isClosing: false }
 */
export function useNewsletterPopup() {
  return {
    showPopup: false,
    closePopup: () => {},
    isClosing: false,
  };
}
