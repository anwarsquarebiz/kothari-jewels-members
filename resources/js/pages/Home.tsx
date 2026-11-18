import { Head } from '@inertiajs/react';
import React, { useEffect, useMemo, useState } from 'react';
import '../../css/landing.css';
import { PIECES, PieceItem, RAIL_ITEMS, RailItem } from '@/components/landing/data';
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
import { useScrollReveal } from '@/components/landing/useLandingAnimations';

interface DynamicProduct {
  id: number;
  slug: string;
  title: string;
  sku: string;
  price: number;
  currency: string;
  formatted_price: string;
  short_description?: string;
  image_url: string | null;
  alt?: string;
  stones?: string[];
  is_feature?: boolean;
  bg?: string | null;
  category_slug?: string;
}

interface HomeProps {
  title?: string;
  description?: string;
  railProducts?: DynamicProduct[];
  jewelleryProducts?: DynamicProduct[];
}

export default function Home({
  railProducts = [],
  jewelleryProducts = [],
}: HomeProps) {
  const [activeView, setActiveView] = useState<'home' | 'jewellery'>('home');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Trigger scroll reveal animations
  useScrollReveal([activeView, activeFilter]);

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

  // Convert railProducts from database or fallback to static items
  const formattedRailItems: RailItem[] = useMemo(() => {
    if (railProducts && railProducts.length > 0) {
      return railProducts.map((p) => ({
        id: p.id,
        label: p.title,
        alt: p.alt || p.title,
        image_url: p.image_url,
        slug: p.slug,
        price: p.price,
        formatted_price: p.formatted_price,
      }));
    }
    return RAIL_ITEMS;
  }, [railProducts]);

  // Convert jewelleryProducts from database or fallback to static items
  const allJewelleryPieces: PieceItem[] = useMemo(() => {
    if (jewelleryProducts && jewelleryProducts.length > 0) {
      return jewelleryProducts.map((p) => ({
        id: p.id,
        title: p.title,
        stones: p.stones && p.stones.length > 0 ? p.stones : ['diamond'],
        bg: p.is_feature && p.bg ? p.bg : undefined,
        image_url: p.image_url,
        price: p.price,
        formatted_price: p.formatted_price,
        sku: p.sku,
        slug: p.slug,
        category_slug: p.category_slug,
      }));
    }
    return PIECES;
  }, [jewelleryProducts]);

  const filteredPieces = useMemo(() => {
    return allJewelleryPieces.filter(
      (p) => activeFilter === 'all' || p.stones.includes(activeFilter)
    );
  }, [allJewelleryPieces, activeFilter]);

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
            <RailSection products={formattedRailItems} onNavigate={handleNavigate} />
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
