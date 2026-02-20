"use client";

import { useState, useEffect } from "react";

/**
 * Translation Component
 *
 * Provides multi-language translation support across all iiskills learning apps
 * using the Google Cloud Translation API (https://cloud.google.com/translate).
 *
 * Supports 11 major Indian languages plus English:
 * - Hindi (hi) - 528M speakers
 * - Tamil (ta) - 79M speakers
 * - Telugu (te) - 95M speakers
 * - Bengali (bn) - 97M speakers
 * - Marathi (mr) - 83M speakers
 * - Gujarati (gu) - 56M speakers
 * - Kannada (kn) - 44M speakers
 * - Malayalam (ml) - 38M speakers
 * - Punjabi (pa) - 33M speakers
 * - Odia (or) - 38M speakers
 * - Urdu (ur) - 51M speakers
 *
 * Usage: <SarvamTranslate />
 *
 * The component saves user language preference in localStorage.
 */

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "or", label: "ଓଡ଼ିଆ" },
  { code: "ur", label: "اردو" },
];

export default function SarvamTranslate() {
  const [selectedLang, setSelectedLang] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sarvam_language");
      if (saved && LANGUAGES.find((l) => l.code === saved)) {
        setSelectedLang(saved);
      }
    } catch {
      // localStorage not available (private browsing)
    }
  }, []);

  const handleLanguageChange = async (e) => {
    const targetLang = e.target.value;
    setSelectedLang(targetLang);
    try {
      localStorage.setItem("sarvam_language", targetLang);
    } catch {
      // localStorage not available
    }

    if (targetLang === "en") {
      // Reset to English - reload to restore original content
      window.location.reload();
      return;
    }

    setIsTranslating(true);
    try {
      // Translate visible text nodes on the page via Google Translate API proxy
      const textNodes = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName.toLowerCase();
            if (["script", "style", "noscript", "meta", "link"].includes(tag))
              return NodeFilter.FILTER_REJECT;
            if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        }
      );

      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.textContent.trim().length > 1) {
          textNodes.push(node);
        }
      }

      // Batch translate in chunks of 5 nodes to avoid large payloads
      const chunkSize = 5;
      for (let i = 0; i < textNodes.length; i += chunkSize) {
        const chunk = textNodes.slice(i, i + chunkSize);
        const texts = chunk.map((n) => n.textContent.trim());

        try {
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texts, targetLang }),
          });
          if (res.ok) {
            const { translated } = await res.json();
            chunk.forEach((node, idx) => {
              if (translated[idx]) {
                node.textContent = translated[idx];
              }
            });
          }
        } catch {
          // Silently fail on individual chunk errors
        }
      }
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="sarvam-translate-wrapper">
      <select
        value={selectedLang}
        onChange={handleLanguageChange}
        disabled={isTranslating}
        aria-label="Select Language"
        className="text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-transparent cursor-pointer hover:border-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
      {isTranslating && (
        <span className="text-xs text-gray-500 ml-1">Translating...</span>
      )}
    </div>
  );
}
