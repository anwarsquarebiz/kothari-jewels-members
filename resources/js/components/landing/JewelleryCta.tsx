import React from 'react';

interface JewelleryCtaProps {
  onNavigate: (target: string) => void;
}

export const JewelleryCta: React.FC<JewelleryCtaProps> = ({ onNavigate }) => {
  return (
    <section className="j-cta reveal" aria-label="Appointments">
      <div className="wrap">
        <h2>
          Seen best <em>in the hand.</em>
        </h2>
        <div className="reveal reveal-delay-1" style={{ flex: '0 1 380px' }}>
          <p>Silverene, 32 Altamount Road, Mumbai 400026. Monday to Saturday, 11 AM to 7 PM.</p>
          <div className="btns caps" style={{ margin: 0 }}>
            <a
              href="https://wa.me/919820515907?text=Hi%2C%20I%20would%20like%20to%20book%20an%20appointment%20to%20visit%20the%20boutique%20at%20Silverene%2C%20Altamount%20Road."
              target="_blank"
              rel="noopener noreferrer"
              className="btn solid"
            >
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

