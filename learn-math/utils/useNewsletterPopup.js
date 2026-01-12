import { useState, useEffect } from 'react'

/**
 * Hook to manage newsletter popup display
 * Shows popup on initial visit or at configured intervals
 * 
 * @param {number} intervalDays - Days between popup displays (default: 7)
 * @returns {object} - { showPopup, closePopup }
 */
export function useNewsletterPopup(intervalDays = 7) {
  const [showPopup, setShowPopup] = useState(false)
  const STORAGE_KEY = 'iiskills_newsletter_popup'

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkPopupDisplay = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        
        if (!stored) {
          // First visit - show popup after a short delay
          setTimeout(() => setShowPopup(true), 3000)
          return
        }

        const data = JSON.parse(stored)
        
        // Check if user is subscribed
        if (data.subscribed) {
          return
        }

        // Check if enough time has passed
        const lastShown = new Date(data.lastShown)
        const now = new Date()
        const daysSinceLastShown = (now - lastShown) / (1000 * 60 * 60 * 24)

        if (daysSinceLastShown >= intervalDays) {
          setTimeout(() => setShowPopup(true), 3000)
        }
      } catch (error) {
        console.error('Error checking newsletter popup:', error)
        // On error, show popup to be safe
        setTimeout(() => setShowPopup(true), 3000)
      }
    }

    checkPopupDisplay()
  }, [intervalDays])

  const closePopup = (subscribed = false) => {
    setShowPopup(false)
    
    try {
      const data = {
        lastShown: new Date().toISOString(),
        subscribed: subscribed,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving popup state:', error)
    }
  }

  return { showPopup, closePopup }
}
