import { useEffect, useRef } from 'react';

/**
 * Initializes IntersectionObserver to reveal elements with `.reveal` class as they scroll into view.
 */
export function useScrollReveal(dependencies: any[] = []) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = document.querySelectorAll('.reveal');

    if (prefersReducedMotion) {
      elements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-revealed');
      } else {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, dependencies);
}

/**
 * Adds a subtle, smooth mouse parallax effect to the hero jewelry piece on desktop.
 */
export function useHeroParallax() {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl || typeof window === 'undefined') return;

    if (window.innerWidth <= 900) return; // Only desktop
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = heroEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 12; // subtle max 6px shift
      targetY = y * 12;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      heroEl.style.setProperty('--parallax-x', `${currentX.toFixed(2)}px`);
      heroEl.style.setProperty('--parallax-y', `${currentY.toFixed(2)}px`);

      animationFrameId = requestAnimationFrame(animate);
    };

    heroEl.addEventListener('mousemove', handleMouseMove, { passive: true });
    heroEl.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      heroEl.removeEventListener('mousemove', handleMouseMove);
      heroEl.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return heroRef;
}

