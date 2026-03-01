"use client"; // This component uses React hooks and browser APIs

import { useEffect } from "react";

// Set NEXT_PUBLIC_DISABLE_GOOGLE_TRANSLATE=true to hide the widget in any app.

/**
 * Google Translate Widget Component
 *
 * Canonical Google Translate integration for all iiskills.cloud apps.
 * Mounts once per page load; survives SPA navigation by guarding on
 * the script element id and the window.google.translate API.
 *
 * Supported languages: 12 major Indian languages plus English.
 * Styles are injected once via a <style> tag (no styled-jsx dependency).
 *
 * Usage: included automatically via packages/ui/src/common/Header.js
 */

const TRANSLATE_SCRIPT_ID = 'google-translate-script';
const TRANSLATE_ELEMENT_ID = 'google_translate_element';
const TRANSLATE_STYLE_ID = 'google-translate-styles';
const INCLUDED_LANGUAGES = 'hi,ta,te,bn,mr,gu,kn,ml,pa,or,as,ur';

const TRANSLATE_CSS = `
.google-translate-widget{display:inline-flex;align-items:center;min-width:80px;min-height:28px}
.goog-te-banner-frame{display:none!important}
.goog-te-gadget{font-size:.875rem!important;line-height:1!important}
.goog-te-gadget-simple{background:transparent!important;border:1px solid rgba(0,0,0,.25)!important;border-radius:.375rem!important;padding:.35rem .6rem!important;font-size:.8125rem!important;cursor:pointer!important;white-space:nowrap}
.goog-te-gadget-simple:hover{background:rgba(0,82,204,.08)!important;border-color:#0052cc!important}
.goog-te-gadget-icon{display:inline-block!important;width:16px!important;height:16px!important;margin-right:.25rem!important;vertical-align:middle!important}
.goog-te-menu-frame{max-height:400px!important;overflow-y:auto!important;z-index:99999!important}
.goog-te-menu2-item-selected{background:#0052cc!important}
.goog-te-menu2-item-selected div{color:#fff!important}
@media(max-width:640px){.goog-te-gadget-simple{padding:.25rem .4rem!important;font-size:.75rem!important}}
`;

export default function GoogleTranslate() {
  const disabled = process.env.NEXT_PUBLIC_DISABLE_GOOGLE_TRANSLATE === 'true';

  useEffect(() => {
    // Do nothing if explicitly disabled
    if (disabled) return;

    // Inject styles once
    if (!document.getElementById(TRANSLATE_STYLE_ID)) {
      const style = document.createElement('style');
      style.id = TRANSLATE_STYLE_ID;
      style.textContent = TRANSLATE_CSS;
      document.head.appendChild(style);
    }

    function initWidget() {
      if (!window.google?.translate?.TranslateElement) return;
      // Avoid creating a second widget if one already exists inside the container
      const container = document.getElementById(TRANSLATE_ELEMENT_ID);
      if (!container) return;
      if (container.childElementCount > 0) return; // already initialised
      try {
        const InlineLayout = window.google.translate.TranslateElement.InlineLayout;
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: INCLUDED_LANGUAGES,
            // Only set layout when the InlineLayout enum is available
            ...(InlineLayout != null ? { layout: InlineLayout.SIMPLE } : {}),
            autoDisplay: false,
            multilanguagePage: true,
          },
          TRANSLATE_ELEMENT_ID
        );
      } catch (e) {
        console.warn('[iiskills] Google Translate initialization failed:', e);
      }
    }

    // API already available (back-navigation / remount)
    if (window.google?.translate?.TranslateElement) {
      initWidget();
      return;
    }

    // Script already in DOM but API not ready yet — update callback
    if (document.getElementById(TRANSLATE_SCRIPT_ID)) {
      window.googleTranslateElementInit = initWidget;
      return;
    }

    // First mount: inject script once
    window.googleTranslateElementInit = initWidget;
    const script = document.createElement('script');
    script.id = TRANSLATE_SCRIPT_ID;
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => console.warn('[iiskills] Google Translate script failed to load');
    document.head.appendChild(script);
  }, [disabled]);

  // Hidden (not removed) when disabled so the DOM element stays stable
  if (disabled) return null;

  return (
    <div
      id={TRANSLATE_ELEMENT_ID}
      className="google-translate-widget"
      aria-label="Select language"
      title="Translate this page"
    />
  );
}
