import React, { useState } from 'react';
import { STONES } from './data';

interface StonesSectionProps {
  onSelectFilter: (stoneKey: string) => void;
}

export const StonesSection: React.FC<StonesSectionProps> = ({ onSelectFilter }) => {
  const [selectedStoneKey, setSelectedStoneKey] = useState<string>('emerald');
  const currentStone = STONES[selectedStoneKey] || STONES['emerald'];

  return (
    <section
      className="stones reveal"
      id="stones"
      aria-label="The stones"
      style={
        {
          background: currentStone.bg,
          color: currentStone.fg,
          '--stone-line': currentStone.line,
        } as React.CSSProperties
      }
    >
      <div className="wrap">
        <div className="stones-top reveal reveal-delay-1">
          <h2>The Stones</h2>
          <div className="tabs caps" role="tablist" aria-label="Choose a stone">
            {Object.keys(STONES).map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                data-k={k}
                aria-selected={selectedStoneKey === k}
                onClick={() => setSelectedStoneKey(k)}
              >
                {STONES[k].name}
              </button>
            ))}
          </div>
        </div>
        <div className="stone-panel" role="tabpanel" key={selectedStoneKey}>
          <div className="stone-copy">
            <p className="stone-name">{currentStone.name}</p>
            <p className="stone-line">{currentStone.text}</p>
            <p className="stone-count caps">{currentStone.count}</p>
            <a
              href="#jewellery"
              className="link caps"
              onClick={(e) => {
                e.preventDefault();
                onSelectFilter(selectedStoneKey);
              }}
            >
              View the pieces
            </a>
          </div>
          <div className="stone-imgs">
            <div className="stone-hero" style={{ background: currentStone.panel }}>
              <span
                className={`im i-${currentStone.hero[0]}`}
                role="img"
                aria-label={currentStone.hero[1]}
              />
            </div>
            {currentStone.more.map((item, index) => (
              <div key={index} className="stone-more" style={{ background: currentStone.panel }}>
                <span className={`im i-${item[0]}`} role="img" aria-label={item[1]} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

