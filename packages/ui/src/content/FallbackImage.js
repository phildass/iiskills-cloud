/**
 * FallbackImage
 *
 * Renders an <img> element with an onError handler. If the image fails to
 * load (broken or missing URL), it automatically switches to a clickable
 * "View Image" link that opens the original URL in a new tab.
 *
 * Usage:
 *   <FallbackImage src={url} alt="description" style={{ width: "100%" }} />
 */

import { useState } from "react";

export default function FallbackImage({ src, alt, style, className, loading, ...rest }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={{
          display: "inline-block",
          padding: "0.375rem 0.75rem",
          color: "#2563eb",
          textDecoration: "underline",
          fontSize: "0.9375rem",
          ...style,
        }}
      >
        View Image
      </a>
    );
  }

  return (
    // Using native <img> instead of next/image for flexible fallback behavior
    <img
      src={src}
      alt={alt}
      style={style}
      className={className}
      loading={loading}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
