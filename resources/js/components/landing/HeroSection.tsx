import React from 'react';

interface HeroSectionProps {
  onNavigate: (target: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="hero" id="top" aria-label="A new expression of Kothari">
      <div className="wrap">
        <div className="hero-copy">
          <p className="caps" style={{ margin: 0 }}>
            Now open &nbsp;·&nbsp; Silverene, 32 Altamount Road
          </p>
          <div>
            <h1>
              A new expression <em>of Kothari.</em>
            </h1>
            <p className="lede">
              Jewellery for those discovering this world for the first time, as much as for those who
              have loved it for a lifetime.
            </p>
            <div className="ctas caps">
              <a
                href="#jewellery"
                className="link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('#jewellery');
                }}
              >
                Discover the jewellery
              </a>
              <a
                href="#visit"
                className="link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('#visit');
                }}
              >
                Visit the house
              </a>
            </div>
          </div>
          <p className="est">Est. 1937, Mumbai</p>
        </div>
        <div className="hero-img">
          <span
            className="im i-emerald-pendant-necklace"
            role="img"
            aria-label="Emerald and diamond pendant necklace"
          />
        </div>
      </div>
    </section>
  );
};

