import React from 'react';

interface StatementSectionProps {
  onNavigate: (target: string) => void;
}

export const StatementSection: React.FC<StatementSectionProps> = ({ onNavigate }) => {
  return (
    <section className="statement" aria-label="The jewellery">
      <div className="wrap">
        <p className="caps">The Jewellery</p>
        <p className="big">
          Lighter in spirit,{' '}
          <span className="im i-coil-earrings" aria-hidden="true" style={{ height: '0.78em' }} />{' '}
          broader in <em>imagination,</em> and designed to be{' '}
          <span
            className="im i-emerald-ring"
            aria-hidden="true"
            style={{ height: '0.95em', verticalAlign: '-0.16em' }}
          />{' '}
          enjoyed <em>often.</em>
        </p>
        <div className="statement-foot">
          <p>
            From fresh interpretations of familiar forms to pieces that are unexpected, playful and
            entirely their own.
          </p>
          <a
            href="#jewellery"
            className="link caps"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#jewellery');
            }}
          >
            See all pieces
          </a>
        </div>
      </div>
    </section>
  );
};

