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
        {pieces.map((p) => {
          const isFeature = Boolean(p.bg && isAllFilter);
          const stText = getStonesText(p.stones);

          return (
            <article key={p.id} className={`piece${isFeature ? ' feature' : ''}`}>
              <div
                className="tile"
                style={isFeature && p.bg ? { background: p.bg } : undefined}
              >
                <span
                  className={`im i-${p.id}`}
                  role="img"
                  aria-label={`${p.title} in ${stText.toLowerCase()}`}
                />
              </div>
              <div className="piece-meta">
                <div>
                  <p>{p.title}</p>
                  <p>{stText}</p>
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

