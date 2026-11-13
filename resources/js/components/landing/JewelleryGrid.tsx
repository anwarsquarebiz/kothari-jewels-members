import React from 'react';
import { getStonesText, PieceItem } from './data';

interface JewelleryGridProps {
  pieces: PieceItem[];
  isAllFilter: boolean;
}

export const JewelleryGrid: React.FC<JewelleryGridProps> = ({ pieces, isAllFilter }) => {
  return (
    <section className="grid-sec" aria-label="Pieces">
      <div className="grid wrap" id="grid">
        {pieces.map((p, index) => {
          const isFeature = Boolean(p.bg && isAllFilter);
          const stText = getStonesText(p.stones);

          return (
            <article
              key={p.id}
              className={`piece${isFeature ? ' feature' : ''}`}
              style={{ '--stagger': Math.min(index, 12) } as React.CSSProperties}
            >
              <div
                className="tile"
                style={!p.image_url && isFeature && p.bg ? { background: p.bg } : undefined}
              >
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={`${p.title} in ${stText.toLowerCase()}`}
                    className="im"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    loading="lazy"
                  />
                ) : (
                  <span
                    className={`im i-${p.id}`}
                    role="img"
                    aria-label={`${p.title} in ${stText.toLowerCase()}`}
                  />
                )}
              </div>
              <div className="piece-meta">
                <div>
                  <p>{p.title}</p>
                  <p>{stText || (p.formatted_price ? p.formatted_price : '')}</p>
                </div>
                <a
                  className="caps"
                  href="tel:+919820515907"
                  aria-label={`Enquire about the ${p.title.toLowerCase()}`}
                >
                  Enquire
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
