/**
 * GeographyMedia Component
 *
 * Displays a relevant map image and 1–3 illustrative photos alongside
 * geography lesson content.  Designed to be "fun" – visuals are prominent,
 * responsive, and lazy-loaded.
 *
 * Usage:
 *   <GeographyMedia moduleId={moduleId} />
 *
 * On desktop the panel appears to the right of the lesson text.
 * On mobile it collapses inline below the lesson content.
 */

import Image from 'next/image';
import { getModuleMedia } from '../data/geographyMedia';

export default function GeographyMedia({ moduleId }) {
  const media = getModuleMedia(moduleId);
  if (!media) return null;

  return (
    <aside className="geography-media-panel">
      {/* Map */}
      <div className="geography-media-map">
        <div className="geography-media-map-label">🗺️ Map</div>
        <div className="geography-media-img-wrap">
          <Image
            src={media.mapUrl}
            alt={media.mapAlt}
            width={480}
            height={300}
            className="geography-media-img"
            style={{ objectFit: 'cover', borderRadius: '8px' }}
            unoptimized
          />
        </div>
        <p className="geography-media-caption">{media.mapAlt}</p>
      </div>

      {/* Photos */}
      {media.photos && media.photos.length > 0 && (
        <div className="geography-media-photos">
          <div className="geography-media-map-label">📷 Visuals</div>
          {media.photos.map((photo, i) => (
            <div key={i} className="geography-media-photo-item">
              <div className="geography-media-img-wrap">
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  width={480}
                  height={280}
                  className="geography-media-img"
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                  unoptimized
                />
              </div>
              {photo.caption && (
                <p className="geography-media-caption">{photo.caption}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .geography-media-panel {
          background: #f0f9f0;
          border: 1px solid #c3e6c3;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        .geography-media-map-label {
          font-weight: 700;
          font-size: 0.875rem;
          color: #1a5c1a;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .geography-media-map {
          margin-bottom: 1.25rem;
        }
        .geography-media-photos {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .geography-media-photo-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .geography-media-img-wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 8px;
          background: #e0e0e0;
        }
        .geography-media-img {
          width: 100% !important;
          height: auto !important;
          display: block;
        }
        .geography-media-caption {
          font-size: 0.75rem;
          color: #4a6741;
          margin: 0.25rem 0 0;
          font-style: italic;
          line-height: 1.4;
        }
      `}</style>
    </aside>
  );
}
