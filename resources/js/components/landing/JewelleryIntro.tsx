import React from 'react';
import { DOTS } from './data';

interface JewelleryIntroProps {
  currentFilter: string;
  onFilterChange: (stoneKey: string) => void;
  count: number;
}

export const JewelleryIntro: React.FC<JewelleryIntroProps> = ({
  currentFilter,
  onFilterChange,
  count,
}) => {
  return (
    <>
      <section className="j-intro" aria-label="Jewellery">
        <div className="wrap">
          <div>
            <p className="caps">Kothari 1937</p>
            <h1>Jewellery</h1>
          </div>
          <p className="lede">
            Fresh interpretations of familiar forms, and pieces that are unexpected, playful and
            entirely their own. Every piece can be seen at Silverene, 32 Altamount Road.
          </p>
        </div>
      </section>
      <div className="filterbar">
        <div className="wrap">
          <div className="filters caps" role="group" aria-label="Filter by stone">
            <button
              type="button"
              data-k="all"
              aria-pressed={currentFilter === 'all'}
              onClick={() => onFilterChange('all')}
            >
              All
            </button>
            {Object.keys(DOTS).map((k) => (
              <button
                key={k}
                type="button"
                data-k={k}
                aria-pressed={currentFilter === k}
                onClick={() => onFilterChange(k)}
              >
                <span
                  className="dot"
                  aria-hidden="true"
                  style={{ background: DOTS[k].color }}
                />
                {DOTS[k].name}
              </button>
            ))}
          </div>
          <p className="count" aria-live="polite">
            {count} {count === 1 ? 'piece' : 'pieces'}
          </p>
        </div>
      </div>
    </>
  );
};

