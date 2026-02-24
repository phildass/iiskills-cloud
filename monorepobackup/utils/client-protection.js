/**
 * Client-Side Protection Utilities
 * 
 * Provides browser-level protection against content copying and tampering.
 * 
 * WARNING: These are deterrents, not absolute protections.
 * Determined attackers can bypass client-side protections.
 * Combine with server-side detection, legal protections, and watermarking.
 * 
 * Usage:
 *   import { enableProtections } from '@/utils/client-protection';
 *   
 *   useEffect(() => {
 *     if (process.env.NEXT_PUBLIC_ENABLE_COPY_PROTECTION === 'true') {
 *       enableProtections();
 *     }
 *   }, []);
 */

/**
 * Disable right-click context menu
 * Prevents casual users from accessing browser context menu
 */
export function disableContextMenu() {
  if (typeof window === 'undefined') return;

  const handler = (e) => {
    e.preventDefault();
    return false;
  };

  document.addEventListener('contextmenu', handler);

  return () => {
    document.removeEventListener('contextmenu', handler);
  };
}

/**
 * Disable text selection
 * Makes it harder to copy text content
 */
export function disableTextSelection() {
  if (typeof window === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = `
    * {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
    }
    input, textarea {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
      user-select: text !important;
    }
  `;
  document.head.appendChild(style);

  return () => {
    document.head.removeChild(style);
  };
}

/**
 * Disable common keyboard shortcuts for copying
 */
export function disableCopyShortcuts() {
  if (typeof window === 'undefined') return;

  const handler = (e) => {
    // Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+A, Ctrl+U (view source), Ctrl+P (print)
    if (
      (e.ctrlKey || e.metaKey) &&
      ['c', 'x', 'v', 'a', 'u', 'p', 's'].includes(e.key.toLowerCase())
    ) {
      e.preventDefault();
      return false;
    }

    // F12, Ctrl+Shift+I (DevTools)
    if (
      e.key === 'F12' ||
      ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I')
    ) {
      e.preventDefault();
      return false;
    }
  };

  document.addEventListener('keydown', handler);

  return () => {
    document.removeEventListener('keydown', handler);
  };
}

/**
 * Prevent drag and drop of content
 */
export function disableDragDrop() {
  if (typeof window === 'undefined') return;

  const handler = (e) => {
    e.preventDefault();
    return false;
  };

  document.addEventListener('dragstart', handler);
  document.addEventListener('drop', handler);

  return () => {
    document.removeEventListener('dragstart', handler);
    document.removeEventListener('drop', handler);
  };
}

/**
 * Add watermark to the page
 * Creates a semi-transparent overlay with user/session information
 * 
 * @param {Object} options - Watermark configuration
 * @param {string} options.text - Text to display (e.g., user email, session ID)
 * @param {number} options.opacity - Opacity value (0-1)
 */
export function addWatermark({ text = '', opacity = 0.1 } = {}) {
  if (typeof window === 'undefined' || !text) return;

  const watermark = document.createElement('div');
  watermark.id = 'protection-watermark';
  watermark.textContent = text;
  watermark.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 4rem;
    color: rgba(0, 0, 0, ${opacity});
    pointer-events: none;
    z-index: 9999;
    user-select: none;
    white-space: nowrap;
  `;

  document.body.appendChild(watermark);

  return () => {
    const el = document.getElementById('protection-watermark');
    if (el) document.body.removeChild(el);
  };
}

/**
 * Detect DevTools opening
 * Monitors for developer tools and can trigger custom behavior
 * 
 * @param {Function} onDetect - Callback when DevTools detected
 */
export function detectDevTools(onDetect) {
  if (typeof window === 'undefined') return;

  const threshold = 160;
  let isDevToolsOpen = false;

  const check = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    const orientation = widthThreshold ? 'vertical' : 'horizontal';

    if (!(heightThreshold && widthThreshold) && ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)) {
      if (!isDevToolsOpen) {
        isDevToolsOpen = true;
        if (onDetect) onDetect(true, orientation);
      }
    } else {
      if (isDevToolsOpen) {
        isDevToolsOpen = false;
        if (onDetect) onDetect(false, orientation);
      }
    }
  };

  const interval = setInterval(check, 1000);

  return () => {
    clearInterval(interval);
  };
}

/**
 * Enable all protections
 * Convenience function to enable all protection measures at once
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.contextMenu - Enable context menu protection
 * @param {boolean} options.textSelection - Enable text selection protection
 * @param {boolean} options.copyShortcuts - Enable copy shortcut protection
 * @param {boolean} options.dragDrop - Enable drag & drop protection
 * @param {Object} options.watermark - Watermark configuration (if provided)
 * @param {Function} options.onDevTools - DevTools detection callback
 * @returns {Function} Cleanup function to remove all protections
 */
export function enableProtections({
  contextMenu = true,
  textSelection = true,
  copyShortcuts = true,
  dragDrop = true,
  watermark = null,
  onDevTools = null
} = {}) {
  const cleanups = [];

  if (contextMenu) {
    const cleanup = disableContextMenu();
    if (cleanup) cleanups.push(cleanup);
  }

  if (textSelection) {
    const cleanup = disableTextSelection();
    if (cleanup) cleanups.push(cleanup);
  }

  if (copyShortcuts) {
    const cleanup = disableCopyShortcuts();
    if (cleanup) cleanups.push(cleanup);
  }

  if (dragDrop) {
    const cleanup = disableDragDrop();
    if (cleanup) cleanups.push(cleanup);
  }

  if (watermark) {
    const cleanup = addWatermark(watermark);
    if (cleanup) cleanups.push(cleanup);
  }

  if (onDevTools) {
    const cleanup = detectDevTools(onDevTools);
    if (cleanup) cleanups.push(cleanup);
  }

  // Return cleanup function
  return () => {
    cleanups.forEach(cleanup => {
      if (typeof cleanup === 'function') cleanup();
    });
  };
}

/**
 * React hook for enabling protections
 * 
 * @param {Object} options - Same as enableProtections options
 * 
 * @example
 * function MyComponent() {
 *   useProtection({
 *     watermark: { text: user.email }
 *   });
 *   return <div>Protected content</div>;
 * }
 */
export function useProtection(options = {}) {
  if (typeof window === 'undefined') return;

  const React = require('react');
  const { useEffect, useRef } = React;

  // Store stringified options to detect changes without causing unnecessary re-renders
  const optionsRef = useRef(JSON.stringify(options));
  const currentOptionsStr = JSON.stringify(options);

  useEffect(() => {
    // Only re-enable protections if options actually changed
    if (optionsRef.current !== currentOptionsStr) {
      optionsRef.current = currentOptionsStr;
    }

    const cleanup = enableProtections(options);
    return cleanup;
  }, [currentOptionsStr]); // Depend on string comparison, not object reference
}
