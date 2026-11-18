import { Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { type SharedData } from '@/types';
import { Menu, X } from 'lucide-react';

interface LandingHeaderProps {
  activeView: 'home' | 'jewellery';
  onNavigate: (target: string) => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ activeView, onNavigate }) => {
  const page = usePage<SharedData>();
  const user = page.props?.auth?.user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(hash);
  };

  return (
    <header className="site-head">
      <div className="head wrap">
        {/* Desktop Primary Nav */}
        <nav className="nav caps" aria-label="Primary">
          <a
            href="#jewellery"
            data-nav="jewellery"
            aria-current={activeView === 'jewellery' ? 'page' : 'false'}
            onClick={(e) => handleLinkClick(e, '#jewellery')}
          >
            Jewellery
          </a>
          <a href="#house" onClick={(e) => handleLinkClick(e, '#house')}>
            The House
          </a>
        </nav>

        {/* Brand Logo */}
        <a
          href="#top"
          className="logo"
          aria-label="Kothari 1937, home"
          onClick={(e) => handleLinkClick(e, '#top')}
        >
          <span className="im i-wordmark-white" role="img" aria-label="Kothari 1937" />
        </a>

        {/* Desktop Visit Nav */}
        <nav className="nav nav-r caps" aria-label="Visit">
          <a href="#visit" onClick={(e) => handleLinkClick(e, '#visit')}>
            Altamount Road
          </a>
          <a
            href="https://wa.me/919820515907?text=Hi%2C%20I%20would%20like%20to%20book%20an%20appointment%20to%20visit%20the%20boutique%20at%20Silverene%2C%20Altamount%20Road."
            target="_blank"
            rel="noopener noreferrer"
            className="appt"
          >
            Appointments
          </a>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="mobile-nav-toggle"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="size-6 text-[#c9ae7e]" />
          ) : (
            <Menu className="size-6 text-[#c9ae7e]" />
          )}
        </button>
      </div>

      {/* Mobile Drawer (Fixed overlay that does NOT push content) */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer caps" aria-label="Mobile Navigation">
          <a
            href="#jewellery"
            data-nav="jewellery"
            aria-current={activeView === 'jewellery' ? 'page' : 'false'}
            onClick={(e) => handleLinkClick(e, '#jewellery')}
          >
            Jewellery
          </a>
          <a href="#house" onClick={(e) => handleLinkClick(e, '#house')}>
            The House
          </a>
          <a href="#visit" onClick={(e) => handleLinkClick(e, '#visit')}>
            Altamount Road
          </a>
          <a
            href="https://wa.me/919820515907?text=Hi%2C%20I%20would%20like%20to%20book%20an%20appointment%20to%20visit%20the%20boutique%20at%20Silverene%2C%20Altamount%20Road."
            target="_blank"
            rel="noopener noreferrer"
            className="appt"
            onClick={() => setMobileMenuOpen(false)}
          >
            Appointments
          </a>
          {user ? (
            <Link href="/products" className="appt" onClick={() => setMobileMenuOpen(false)}>
              Member Portal →
            </Link>
          ) : (
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              Member Sign In →
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
