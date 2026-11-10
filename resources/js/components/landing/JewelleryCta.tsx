import React from 'react';

interface JewelleryCtaProps {
  onNavigate: (target: string) => void;
}

export const JewelleryCta: React.FC<JewelleryCtaProps> = ({ onNavigate }) => {
  return (
    <section className="j-cta" aria-label="Appointments">
      <div className="wrap">
        <h2>
          Seen best <em>in the hand.</em>
        </h2>
        <div style={{ flex: '0 1 380px' }}>
          <p>Silverene, 32 Altamount Road, Mumbai 400026. Monday to Saturday, 11 AM to 7 PM.</p>
          <div className="btns caps" style={{ margin: 0 }}>
            <a href="tel:+919820515907" className="btn solid">
              Book an appointment
            </a>
            <a
              href="#visit"
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('#visit');
              }}
            >
              The boutique
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

