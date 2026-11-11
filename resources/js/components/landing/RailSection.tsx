import React from 'react';
import { RAIL_ITEMS } from './data';

interface RailSectionProps {
  onNavigate: (target: string) => void;
}

export const RailSection: React.FC<RailSectionProps> = ({ onNavigate }) => {
  return (
    <section className="rail-sec reveal" aria-label="Selected pieces">
      <div className="rail-head reveal reveal-delay-1">
        <h2>
          Selected <em>pieces</em>
        </h2>
        <a
          href="#jewellery"
          className="link caps"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('#jewellery');
          }}
        >
          All jewellery
        </a>
      </div>
      <div className="rail reveal reveal-delay-2" tabIndex={0} aria-label="Selected pieces, scrolls sideways">
        {RAIL_ITEMS.map((item) => (
          <a
            key={item.id}
            href="#jewellery"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#jewellery');
            }}
          >
            <div className="tile">
              <span className={`im i-${item.id}`} role="img" aria-label={item.alt} />
            </div>
            <p>{item.label}</p>
          </a>
        ))}
      </div>
    </section>
  );
};

