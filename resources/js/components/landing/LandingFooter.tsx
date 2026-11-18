import React, { useState } from 'react';
import { Instagram } from 'lucide-react';

interface LandingFooterProps {
  onNavigate: (target: string) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onNavigate }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <span className="im i-mono-gold" aria-hidden="true" />
            <span className="im i-wordmark-white" role="img" aria-label="Kothari 1937" />
          </div>
          <form className="news" aria-label="Newsletter" onSubmit={handleSubscribe}>
            <label htmlFor="landing-email" className="caps">
              News from the house
            </label>
            <div className="news-row">
              <input
                id="landing-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                disabled={subscribed}
              />
              <button type="submit" className="caps">
                {subscribed ? 'Thank you' : 'Subscribe'}
              </button>
            </div>
          </form>
        </div>
        <div className="foot-cols">
          <p>
            <a
              href="#jewellery"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('#jewellery');
              }}
            >
              Jewellery
            </a>
            <br />
            <a
              href="#stones"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('#stones');
              }}
            >
              The Stones
            </a>
            <br />
            <a
              href="#house"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('#house');
              }}
            >
              The House
            </a>
            <br />
            <a href="/login" style={{ color: 'var(--gold)' }}>
              Member Access &rarr;
            </a>
          </p>
          <p>
            Silverene, 32 Altamount Road
            <br />
            Mumbai 400026
          </p>
          <p>
            Monday to Saturday
            <br />
            11 AM to 7 PM
          </p>
          <div className="foot-contact-cell">
            <a
              href="https://wa.me/919820515907"
              target="_blank"
              rel="noopener noreferrer"
              className="foot-wa-link"
              title="Chat with Kothari 1937 on WhatsApp"
            >
              +91 98205 15907
            </a>
            <a
              href="https://www.instagram.com/kothari1937official/"
              target="_blank"
              rel="noopener noreferrer"
              className="foot-insta-cta caps"
              title="Follow Kothari 1937 on Instagram"
            >
              <Instagram className="size-3.5 inline-block" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
        <p className="legal caps">© Kothari 1937</p>
      </div>
    </footer>
  );
};

