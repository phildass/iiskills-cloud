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
 * Copy protection is enabled when NEXT_PUBLIC_ENABLE_COPY_PROTECTION=true.
 * The CSS module also applies user-select:none on the container as a baseline.
 *
 * Requires apps to set: transpilePackages: ['@iiskills/ui'] in next.config.js
 */

import { useRef, useEffect } from "react";
import styles from "./lesson-content.module.css";

/**
 * ModuleInProduction
 *
 * Branded placeholder rendered when a lesson slot exists in the platform
 * architecture (up to 2,400 slots) but the content file has not yet been
 * authored.  Prevents 404 pages and paywall confusion for paid users.
 *
 * Usage: pass as the children of LessonContent, or render directly.
 */
export function ModuleInProduction({ moduleTitle, lessonNumber }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "320px",
        padding: "48px 24px",
        textAlign: "center",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        borderRadius: "16px",
        border: "1.5px solid #bae6fd",
        margin: "32px 0",
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚀</div>
      <h2
        style={{
          fontSize: "1.375rem",
          fontWeight: 700,
          color: "#0c4a6e",
          marginBottom: "12px",
        }}
      >
        {moduleTitle || "Advanced Module"}
      </h2>
      <p
        style={{
          fontSize: "1rem",
          color: "#0369a1",
          maxWidth: "480px",
          lineHeight: 1.6,
          marginBottom: "8px",
        }}
      >
        This advanced module is currently being optimized for high-quality
        delivery. Check back soon!
      </p>
      {lessonNumber && (
        <p style={{ fontSize: "0.875rem", color: "#7dd3fc", marginTop: "4px" }}>
          Lesson {lessonNumber}
        </p>
      )}
      <div
        style={{
          marginTop: "24px",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: "#0ea5e9",
          color: "#fff",
          borderRadius: "9999px",
          padding: "6px 16px",
          fontSize: "0.8125rem",
          fontWeight: 600,
        }}
      >
        <span>✦</span> iiskills.cloud — Premium Content Coming
      </div>
    </div>
  );
}

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

  // Block context-menu and copy events on the container when copy protection is enabled
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_COPY_PROTECTION !== "true") return;
    const container = containerRef.current;
    if (!container) return;

    const block = (e) => e.preventDefault();
    container.addEventListener("contextmenu", block);
    container.addEventListener("copy", block);
    container.addEventListener("cut", block);
    container.addEventListener("dragstart", block);

    return () => {
      container.removeEventListener("contextmenu", block);
      container.removeEventListener("copy", block);
      container.removeEventListener("cut", block);
      container.removeEventListener("dragstart", block);
    };
  }, []);

  // Graceful content fallback: if neither html nor children are provided, render
  // the branded "Module In Production" placeholder instead of an empty/404 page.
  if (!html && !children) {
    return <ModuleInProduction />;
  }

  if (html) {
    return (
      <div ref={containerRef} className={cls} dangerouslySetInnerHTML={{ __html: html }} />
    );
  }

  return (
    <div ref={containerRef} className={cls}>
      {children}
    </div>
  );
}
