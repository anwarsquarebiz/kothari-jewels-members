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
          <a href="#stones" onClick={(e) => handleLinkClick(e, '#stones')}>
            The Stones
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

        {/* Desktop Visit & Member Nav */}
        <nav className="nav nav-r caps" aria-label="Visit">
          <a href="#visit" onClick={(e) => handleLinkClick(e, '#visit')}>
            Altamount Road
          </a>
          <a href="tel:+919820515907" className="appt">
            Appointments
          </a>
          {user ? (
            <Link
              href="/products"
              className="appt"
              style={{ borderLeft: '1px solid rgba(237,231,214,0.25)', paddingLeft: '16px' }}
            >
              Member Portal
            </Link>
          ) : (
            <Link
              href="/login"
              style={{ borderLeft: '1px solid rgba(237,231,214,0.25)', paddingLeft: '16px', opacity: 0.85 }}
            >
              Sign In
            </Link>
          )}
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
          <a href="#stones" onClick={(e) => handleLinkClick(e, '#stones')}>
            The Stones
          </a>
          <a href="#house" onClick={(e) => handleLinkClick(e, '#house')}>
            The House
          </a>
          <a href="#visit" onClick={(e) => handleLinkClick(e, '#visit')}>
            Altamount Road
          </a>
          <a href="tel:+919820515907" className="appt" onClick={() => setMobileMenuOpen(false)}>
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
