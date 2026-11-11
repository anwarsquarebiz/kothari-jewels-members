import React from 'react';

export const VisitSection: React.FC = () => {
  return (
    <section className="visit reveal" id="visit" aria-label="Visit Altamount Road">
      <div className="wrap">
        <div className="visit-copy reveal reveal-delay-1">
          <p className="caps">An invitation to discover</p>
          <h2>
            32 Altamount <em>Road</em>
          </h2>
          <p className="visit-lede">
            A new expression of Kothari, at an address we've always called home.
          </p>
          <div className="facts">
            <div>
              <p className="caps" style={{ color: 'var(--soft)' }}>
                Address
              </p>
              <p>
                Silverene, 32 Altamount Road
                <br />
                Mumbai 400026
              </p>
            </div>
            <div>
              <p className="caps" style={{ color: 'var(--soft)' }}>
                Hours
              </p>
              <p>
                Monday to Saturday
                <br />
                11 AM to 7 PM
              </p>
            </div>
            <div>
              <p className="caps" style={{ color: 'var(--soft)' }}>
                Telephone
              </p>
              <p>
                <a href="tel:+919820515907">+91 98205 15907</a>
              </p>
            </div>
          </div>
          <div className="btns">
            <a href="tel:+919820515907" className="btn solid">
              Book an appointment
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Silverene%2C%2032%20Altamount%20Road%2C%20Mumbai%20400026"
              className="btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Directions
            </a>
          </div>
        </div>
        <figure className="reveal reveal-delay-2">
          <div>
            <span
              className="im i-house"
              role="img"
              aria-label="Illustration of the Kothari 1937 boutique at Silverene, Altamount Road"
            />
          </div>
          <figcaption>Silverene, as drawn for the opening.</figcaption>
        </figure>
      </div>
    </section>
  );
};

