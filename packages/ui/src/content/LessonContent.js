/**
 * LessonContent
 *
 * Shared renderer for lesson body content across all learn-* apps.
 * Accepts either pre-rendered HTML (html prop) or React children
 * (e.g. ReactMarkdown output) and wraps them in a consistently styled
 * reading-width container.
 *
 * Requires apps to set: transpilePackages: ['@iiskills/ui'] in next.config.js
 */

import styles from './lesson-content.module.css';

export default function LessonContent({ html, children, className }) {
  const cls = [styles.container, className].filter(Boolean).join(' ');

  if (html) {
    return (
      <div
        className={cls}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return <div className={cls}>{children}</div>;
}
