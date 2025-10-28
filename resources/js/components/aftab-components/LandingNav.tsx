import { useState } from "react";
import { Menu, X, User } from "lucide-react";
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
    <nav
      // style={{
      //   backgroundColor: "#cda678",
      //   backgroundImage:
      //     "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%2392663e' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E\")",
      // }}
      className="fixed w-screen top-0 left-0 right-0 z-[9999] px-4 sm:px-8 py-6"
    >
      <div className="flex items-center relative z-[9999] justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => handleNavClick("/")}
          className={`tracking-widest hover:opacity-70 transition-opacity text-lg sm:text-base font-medium ${textColor}`}
        >
          {/* ${(currentPage === "/" || currentPage === "/about") && "invert"} */}

          <img
            className={`w-[120px] h-auto transition-all duration-300`}
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
              className={`tracking-wide text-neutral-900 font-medium text-sm transition-opacity duration-200 ${
                currentPage === page
                  ? "opacity-100"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              {label}
            </Link>
          ))}
          {/* Login Icon - Desktop */}
          <Link
            href="/login"
            className={`transition-opacity hover:opacity-70 text-neutral-900`}
            aria-label="Login"
          >
            <User size={18} />
          </Link>
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
            {/* Login Link - Mobile */}
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="tracking-wide font-medium text-left text-neutral-100 py-2 text-sm transition-opacity duration-200 opacity-60 hover:opacity-100 flex items-center gap-2"
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
