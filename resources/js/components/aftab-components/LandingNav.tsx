// resources/js/components/aftab-components/LandingNav.tsx

import { useState, useEffect, useRef } from "react";
import { Menu, X, User } from "lucide-react";
import { Link } from "@inertiajs/react";

type Page = "/" | "/about" | "/contact";

interface LandingNavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isLightPage: boolean;
  // THE ONLY CHANGE: This optional ref allows the About page to pass its scroll container
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

export function LandingNav({
  currentPage,
  setCurrentPage,
  isLightPage,
  scrollContainerRef, // Receive the ref
}: LandingNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const initialTextColor = isLightPage ? "text-neutral-900" : "text-white";

  const navItems: { label: string; page: Page }[] = [
    { label: "Home", page: "/" },
    { label: "About", page: "/about" },
    { label: "Contact", page: "/contact" },
  ];

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    setIsOpen(false);
  };

  // --- Check for mobile screen size ---
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // --- THE CORE FIX: Scroll logic that can handle window OR a custom container ---
  useEffect(() => {
    // KEY CHANGE: If a scrollContainerRef is passed (like on About page), use it. Otherwise, use window.
    const scrollElement = scrollContainerRef?.current || window;

    const handleScroll = () => {
      // Get scroll position from the correct element
      const scrollPosition =
        scrollElement === window ? window.scrollY : scrollElement.scrollTop;

      if (scrollPosition > 10 && !isScrolled) {
        setIsScrolled(true);
      } else if (scrollPosition <= 10 && isScrolled) {
        setIsScrolled(false);
      }
    };

    // Add listener to the correct element
    scrollElement.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup function
    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled, scrollContainerRef]); // Re-run if ref changes

  return (
    <nav
      ref={navRef}
      // Conditionally apply background color on mobile scroll
      className={`w-full z-50 fixed top-0 left-0 p-4 transition-colors duration-300 ${
        isMobile && isScrolled ? "bg-white" : "bg-transparent"
      }`}
    >
      <div className="flex items-center relative z-[9999] justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => handleNavClick("/")}
          className="tracking-widest hover:opacity-70 transition-opacity text-lg sm:text-base font-medium"
        >
          <img
            // Logic for logo source and invert class
            className={`w-[120px] h-auto transition-all duration-300 ${
              !isLightPage ? "invert" : ""
            }`}
            src={"/media/logo.webp"}
            alt="Kothari Fine Jewels"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 lg:gap-12">
          {navItems.map(({ label, page }) => (
            <Link
              key={page}
              href={page}
              onClick={() => handleNavClick(page)}
              className={`tracking-wide font-medium text-sm transition-all duration-200 ${
                currentPage === page
                  ? isLightPage
                    ? "text-neutral-900 opacity-100"
                    : "text-white opacity-100"
                  : isLightPage
                  ? "text-neutral-900 opacity-60 hover:opacity-100"
                  : "text-white opacity-60 hover:opacity-100"
              }`}
            >
              {label}
            </Link>
          ))}
          {/* Login Icon - Desktop */}
          <Link
            href="/login"
            className={`transition-opacity hover:opacity-70 ${
              isLightPage ? "text-neutral-900" : "text-white"
            }`}
            aria-label="Login"
          >
            <User size={18} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          // Conditionally apply icon color on mobile scroll
          className={`lg:hidden transition-opacity hover:opacity-70 ${
            isMobile && isScrolled ? "text-neutral-900" : initialTextColor
          }`}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          className={`fixed w-full left-0 top-0 z-50 backdrop-blur-md bg-opacity-95 ${
            isLightPage
              ? "bg-white/80 text-neutral-900"
              : "bg-neutral-950/80 text-white"
          }`}
        >
          <div className="container mx-auto flex flex-col px-4 sm:px-8 py-12 sm:py-12 mt-12 space-y-4 shadow-lg">
            {navItems.map(({ label, page }) => (
              <Link
                key={page}
                href={page}
                onClick={() => handleNavClick(page)}
                className={`tracking-wide font-medium text-left py-2 text-sm transition-all duration-200 ${
                  currentPage === page
                    ? "opacity-100"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                {label}
              </Link>
            ))}
            {/* Login Link - Mobile */}
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className={`tracking-wide ${
                isLightPage ? "text-neutral-900" : "text-neutral-100"
              } font-medium text-left py-2 text-sm transition-opacity duration-200 flex items-center gap-2`}
            >
              <User size={18} />
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
