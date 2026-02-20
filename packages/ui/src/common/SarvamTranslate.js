"use client";

import { useState, useEffect } from "react";

/**
 * Sarvam API Translation Component
 *
 * Provides multi-language translation support across all iiskills learning apps
 * using the Sarvam AI translation API (https://sarvam.ai/).
 *
 * Supports 11 major Indian languages plus English:
 * - Hindi (hi-IN) - 528M speakers
 * - Tamil (ta-IN) - 79M speakers
 * - Telugu (te-IN) - 95M speakers
 * - Bengali (bn-IN) - 97M speakers
 * - Marathi (mr-IN) - 83M speakers
 * - Gujarati (gu-IN) - 56M speakers
 * - Kannada (kn-IN) - 44M speakers
 * - Malayalam (ml-IN) - 38M speakers
 * - Punjabi (pa-IN) - 33M speakers
 * - Odia (or-IN) - 38M speakers
 * - Urdu (ur-IN) - 51M speakers
 *
 * Usage: <SarvamTranslate />
 *
 * The component saves user language preference in localStorage.
 */

const LANGUAGES = [
  { code: "en-IN", label: "English" },
  { code: "hi-IN", label: "हिंदी" },
  { code: "ta-IN", label: "தமிழ்" },
  { code: "te-IN", label: "తెలుగు" },
  { code: "bn-IN", label: "বাংলা" },
  { code: "mr-IN", label: "मराठी" },
  { code: "gu-IN", label: "ગુજરાતી" },
  { code: "kn-IN", label: "ಕನ್ನಡ" },
  { code: "ml-IN", label: "മലയാളം" },
  { code: "pa-IN", label: "ਪੰਜਾਬੀ" },
  { code: "or-IN", label: "ଓଡ଼ିଆ" },
  { code: "ur-IN", label: "اردو" },
];

export default function SarvamTranslate() {
  const [selectedLang, setSelectedLang] = useState("en-IN");
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

    if (targetLang === "en-IN") {
      // Reset to English - reload to restore original content
      window.location.reload();
      return;
    }

    setIsTranslating(true);
    try {
      // Translate visible text nodes on the page via Sarvam API proxy
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
