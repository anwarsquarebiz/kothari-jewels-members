import React from 'react';

export const HouseSection: React.FC = () => {
  return (
    <section className="house reveal" id="house" aria-label="The house">
      <div className="wrap">
        <p className="caps">The House</p>
        <div className="numeral reveal reveal-delay-1" aria-hidden="true">
          <p>1937</p>
          <span className="im i-emerald-line-bracelet" aria-hidden="true" />
        </div>
        <div className="beats">
          <div className="reveal reveal-delay-1">
            <h3>1937</h3>
            <p>Our journey in the world of precious stones and jewellery begins.</p>
          </div>
          <div className="reveal reveal-delay-2">
            <h3>Since</h3>
            <p>
              Over generations, the privilege of meeting remarkable people, discovering extraordinary
              stones, and creating jewels that have become part of families and their stories.
            </p>
          </div>
          <div className="reveal reveal-delay-3">
            <h3>Today</h3>
            <p>A new expression of our house, with a space of its own on Altamount Road.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

