/**
 * GeographyMedia Component
 *
 * Renders lesson-specific geography images inline within lesson content.
 * When a per-lesson media entry exists (Module 1, Lessons 1–4) it uses that;
 * otherwise it falls back to module-level media.
 *
 * Images are rendered inline between content sections rather than as a
 * separate top panel.
 *
 * Usage:
 *   <GeographyMedia moduleId={moduleId} lessonId={lessonId} />
 */

import { getLessonMedia } from '../data/geographyMedia';

export default function GeographyMedia({ moduleId, lessonId }) {
  const media = getLessonMedia(moduleId, lessonId);
  if (!media) return null;

  return (
    <div className="geography-media-inline">
      {/* Map */}
      <figure className="geography-media-figure">
        <div className="geography-media-img-wrap">
          <Image
            src={media.mapUrl}
            alt={media.mapAlt}
            width={640}
            height={360}
            className="geography-media-img"
            style={{ objectFit: 'cover', borderRadius: '8px' }}
            unoptimized
          />
        </div>
        <figcaption className="geography-media-caption">🗺️ {media.mapAlt}</figcaption>
      </figure>

      {/* Photos */}
      {media.photos && media.photos.length > 0 && (
        <div className="geography-media-photos">
          {media.photos.map((photo, i) => (
            <figure key={i} className="geography-media-figure">
              <div className="geography-media-img-wrap">
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  width={640}
                  height={360}
                  className="geography-media-img"
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                  unoptimized
                />
              </div>
              {photo.caption && (
                <figcaption className="geography-media-caption">📷 {photo.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      <style jsx>{`
        .geography-media-inline {
          margin: 2rem 0;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .geography-media-photos {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .geography-media-figure {
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .geography-media-img-wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 8px;
          background: #e8f5e9;
          border: 1px solid #c8e6c9;
        }
        .geography-media-img {
          width: 100% !important;
          height: auto !important;
          display: block;
        }
        .geography-media-caption {
          font-size: 0.8125rem;
          color: #4a6741;
          font-style: italic;
          line-height: 1.4;
          padding: 0 0.25rem;
        }
        @media (min-width: 640px) {
          .geography-media-photos {
            flex-direction: row;
            flex-wrap: wrap;
          }
          .geography-media-photos .geography-media-figure {
            flex: 1 1 45%;
          }
        }
      `}</style>
    </div>
  );
}
