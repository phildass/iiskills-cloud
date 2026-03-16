/**
 * LessonContent
 *
 * Shared renderer for lesson body content across all learn-* apps.
 * Accepts either pre-rendered HTML (html prop) or React children
 * (e.g. ReactMarkdown output) and wraps them in a consistently styled
 * reading-width container.
 *
 * When the html prop is used, any <img> elements that fail to load are
 * automatically replaced with a clickable "View Image" link that opens
 * the image URL in a new tab.
 *
 * Requires apps to set: transpilePackages: ['@iiskills/ui'] in next.config.js
 */

import { useRef, useEffect } from "react";
import styles from "./lesson-content.module.css";

export default function LessonContent({ html, children, className }) {
  const cls = [styles.container, className].filter(Boolean).join(" ");
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const imgs = Array.from(container.querySelectorAll("img"));
    const cleanups = [];

    imgs.forEach((img) => {
      const replaceWithLink = () => {
        if (!img.parentNode) return;
        const link = document.createElement("a");
        link.href = img.src;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "View Image";
        link.style.cssText =
          "display:inline-block;padding:0.375rem 0.75rem;color:#2563eb;text-decoration:underline;font-size:0.9375rem;";
        img.parentNode.replaceChild(link, img);
      };

      // Handle images that fail after the effect runs
      img.addEventListener("error", replaceWithLink);
      cleanups.push(() => img.removeEventListener("error", replaceWithLink));

      // Handle images that already failed before the effect ran
      if (img.complete && img.naturalWidth === 0 && img.src) {
        replaceWithLink();
      }
    });

    return () => cleanups.forEach((fn) => fn());
  }, [html]);

  if (html) {
    return (
      <div ref={containerRef} className={cls} dangerouslySetInnerHTML={{ __html: html }} />
    );
  }

  return <div className={cls}>{children}</div>;
}
