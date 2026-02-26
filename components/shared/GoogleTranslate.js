"use client"; // This component uses React hooks and browser APIs

import { useEffect } from "react";

/**
 * @deprecated Do not use. Use packages/ui/src/common/GoogleTranslate (via @iiskills/ui/common)
 * instead. This legacy wrapper is no longer imported anywhere; kept only to avoid breaking
 * any future stale imports.
 *
 * Google Translate Widget – legacy shared components wrapper.
 * Delegates to the same canonical logic as packages/ui/src/common/GoogleTranslate.js.
 * Styles are injected once via a <style> tag (no styled-jsx dependency).
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
.goog-te-gadget-icon{display:inline-block!important;margin-right:.25rem!important}
.goog-te-menu-frame{max-height:400px!important;overflow-y:auto!important;z-index:99999!important}
.goog-te-menu2-item-selected{background:#0052cc!important}
.goog-te-menu2-item-selected div{color:#fff!important}
@media(max-width:640px){.goog-te-gadget-simple{padding:.25rem .4rem!important;font-size:.75rem!important}}
`;

export default function GoogleTranslate() {
  useEffect(() => {
    if (!document.getElementById(TRANSLATE_STYLE_ID)) {
      const style = document.createElement('style');
      style.id = TRANSLATE_STYLE_ID;
      style.textContent = TRANSLATE_CSS;
      document.head.appendChild(style);
    }

    function initWidget() {
      if (!window.google?.translate?.TranslateElement) return;
      const container = document.getElementById(TRANSLATE_ELEMENT_ID);
      if (!container) return;
      if (container.childElementCount > 0) return;
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

    if (window.google?.translate?.TranslateElement) {
      initWidget();
      return;
    }

    if (document.getElementById(TRANSLATE_SCRIPT_ID)) {
      window.googleTranslateElementInit = initWidget;
      return;
    }

    window.googleTranslateElementInit = initWidget;
    const script = document.createElement('script');
    script.id = TRANSLATE_SCRIPT_ID;
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => console.warn('[iiskills] Google Translate script failed to load');
    document.head.appendChild(script);
  }, []);

  return (
    <div
      id={TRANSLATE_ELEMENT_ID}
      className="google-translate-widget"
      aria-label="Select language"
      title="Translate this page"
    />
  );
}

