import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import '../../css/landing.css';
import { PIECES } from '@/components/landing/data';
import { HeroSection } from '@/components/landing/HeroSection';
import { HouseSection } from '@/components/landing/HouseSection';
import { JewelleryCta } from '@/components/landing/JewelleryCta';
import { JewelleryGrid } from '@/components/landing/JewelleryGrid';
import { JewelleryIntro } from '@/components/landing/JewelleryIntro';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { RailSection } from '@/components/landing/RailSection';
import { StatementSection } from '@/components/landing/StatementSection';
import { StonesSection } from '@/components/landing/StonesSection';
import { VisitSection } from '@/components/landing/VisitSection';

export default function Home() {
  const [activeView, setActiveView] = useState<'home' | 'jewellery'>('home');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Handle URL hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.slice(1);
      const isJewellery = hash === 'jewellery';

      if (isJewellery) {
        setActiveView('jewellery');
        window.scrollTo(0, 0);
      } else {
        setActiveView('home');
        if (hash && hash !== 'top') {
          const el = document.getElementById(hash);
          if (el) {
            setTimeout(() => {
              el.scrollIntoView({ behavior: 'smooth' });
            }, 50);
          }
        } else if (hash === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    // Initial check
    handleHash();

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (target: string) => {
    if (target === '#jewellery') {
      setActiveView('jewellery');
      window.location.hash = 'jewellery';
      window.scrollTo(0, 0);
      return;
    }

    // Navigating to a section on home
    setActiveView('home');
    const id = target.replace('#', '');
    window.location.hash = id;

    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleSelectStoneFromStones = (stoneKey: string) => {
    setActiveFilter(stoneKey);
    setActiveView('jewellery');
    window.location.hash = 'jewellery';
    window.scrollTo(0, 0);
  };

  const filteredPieces = PIECES.filter(
    (p) => activeFilter === 'all' || p.stones.includes(activeFilter)
  );

  return (
    <div className="kothari-landing">
      <Head>
        <title>Kothari 1937 · Fine Jewellery · Altamount Road, Mumbai</title>
        <meta
          name="description"
          content="Kothari 1937. A new expression of our house, at Silverene, 32 Altamount Road, Mumbai."
        />
      </Head>

      <LandingHeader activeView={activeView} onNavigate={handleNavigate} />

      <main>
        {activeView === 'home' ? (
          <div className="view" id="view-home">
            <HeroSection onNavigate={handleNavigate} />
            <StatementSection onNavigate={handleNavigate} />
            <StonesSection onSelectFilter={handleSelectStoneFromStones} />
            <RailSection onNavigate={handleNavigate} />
            <HouseSection />
            <VisitSection />
          </div>
        ) : (
          <div className="view" id="view-jewellery">
            <JewelleryIntro
              currentFilter={activeFilter}
              onFilterChange={setActiveFilter}
              count={filteredPieces.length}
            />
            <JewelleryGrid pieces={filteredPieces} isAllFilter={activeFilter === 'all'} />
            <JewelleryCta onNavigate={handleNavigate} />
          </div>
        )}
      </main>

      <LandingFooter onNavigate={handleNavigate} />
    </div>
  );
}
