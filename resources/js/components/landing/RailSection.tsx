import React from 'react';
import { RAIL_ITEMS, RailItem } from './data';

interface RailSectionProps {
  products?: RailItem[];
  onNavigate: (target: string) => void;
}

export const RailSection: React.FC<RailSectionProps> = ({ products, onNavigate }) => {
  const displayItems: RailItem[] = products && products.length > 0 ? products : RAIL_ITEMS;

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
        {displayItems.map((item) => (
          <a
            key={item.id}
            href="#jewellery"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#jewellery');
            }}
          >
            <div className="tile">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.alt || item.label}
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
                <span className={`im i-${item.id}`} role="img" aria-label={item.alt} />
              )}
            </div>
            <p>{item.label}</p>
          </a>
        ))}
      </div>
    </section>
  );
};
