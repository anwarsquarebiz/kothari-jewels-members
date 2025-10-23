import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@inertiajs/react";

type Page = "/" | "/about" | "/contact";

interface LandingNavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isLightPage: boolean;
}

export function LandingNav({
  currentPage,
  setCurrentPage,
  isLightPage,
}: LandingNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const textColor = isLightPage ? "text-neutral-900" : "text-white";
  const navItems: { label: string; page: Page }[] = [
    { label: "Home", page: "/" },
    { label: "About", page: "/about" },
    { label: "Contact", page: "/contact" },
  ];

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    setIsOpen(false);
  };

  return (
    <nav className="fixed w-screen top-0 left-0 right-0 z-[9999] px-4 sm:px-8 py-6">
      <div className="flex items-center relative z-[9999] justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => handleNavClick("/")}
          className={`tracking-widest hover:opacity-70 transition-opacity text-lg sm:text-base font-medium ${textColor}`}
        >
          <img
            className={`w-[100px] h-auto transition-all duration-300 ${
              (currentPage === "/" || currentPage === "/about") && "invert"
            }`}
            src="/media/logo.webp"
            alt="Kothari Fine Jewels"
          />
        </Link>

        {/* Desktop Navigation */}
        <div
          className={`hidden lg:flex items-center gap-8 lg:gap-12 ${textColor}`}
        >
          {navItems.map(({ label, page }) => (
            <Link
              key={page}
              href={page}
              onClick={() => handleNavClick(page)}
              className={`tracking-wide font-medium text-sm transition-opacity duration-200 ${
                currentPage === page
                  ? "opacity-100"
                  : "opacity-60 hover:opacity-100"
              } ${isLightPage ? "text-neutral-900" : "text-white"}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden transition-opacity hover:opacity-70 ${textColor}`}
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
          <div className="container mx-auto flex flex-col px-4 sm:px-8 py-6 mt-12 space-y-4">
            {navItems.map(({ label, page }) => (
              <Link
                key={page}
                href={page}
                onClick={() => handleNavClick(page)}
                className={`tracking-wide font-medium text-left py-2 text-sm transition-opacity duration-200 ${
                  currentPage === page
                    ? "opacity-100"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
