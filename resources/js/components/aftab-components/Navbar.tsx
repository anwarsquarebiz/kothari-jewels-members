import React, { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { Link } from "@inertiajs/react";

interface NavbarProps {
  setNavHeight?: (height: number) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setNavHeight }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; right: number }>({
    top: 80,
    right: 16,
  });

  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const updateDropdownPos = () => {
    if (menuButtonRef.current) {
      const buttonRect = menuButtonRef.current.getBoundingClientRect();
      const rightOffset = window.innerWidth - buttonRect.right;
      const topOffset = buttonRect.bottom + 5;
      setDropdownPos({ top: topOffset, right: rightOffset });
    }
  };

  const toggleMenu = () => {
    if (!isMenuOpen) {
      updateDropdownPos();
    }
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!navRef.current) return;

    const updateHeight = () => {
      if (navRef.current && setNavHeight) {
        const height = navRef.current.getBoundingClientRect().height;
        setNavHeight(height);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(navRef.current);

    window.addEventListener("resize", updateHeight);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [setNavHeight]);

  useEffect(() => {
    if (isMenuOpen) {
      updateDropdownPos();
      window.addEventListener("resize", updateDropdownPos);
      window.addEventListener("scroll", updateDropdownPos);
      return () => {
        window.removeEventListener("resize", updateDropdownPos);
        window.removeEventListener("scroll", updateDropdownPos);
      };
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="border-b border-gray-200 w-full mx-auto px-4 z-50 bg-white p-4 fixed top-0 left-0"
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-fit gap-3">
            <div className="flex items-center shrink-0">
              <Link href="/products">
                <img
                  className="w-[64px] sm:w-[85px] lg:w-[105px] h-auto object-contain transition-all duration-200"
                  src="/media/kothari-1937-logo-no-bg.svg"
                  alt="Kothari Fine Jewels Logo"
                />
              </Link>
            </div>

            <div className="flex items-center justify-center min-w-0">
              <Link href="/products">
                <img
                  className="h-6 sm:h-8 md:h-10 w-auto max-w-[160px] sm:max-w-[220px] md:max-w-[280px] object-contain"
                  src="/media/kothari-1937-only-text.svg"
                  alt="Kothari 1937"
                />
              </Link>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                ref={menuButtonRef}
                onClick={toggleMenu}
                className="p-2 text-gray-800 hover:text-amber-700 transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div
          ref={menuRef}
          style={{
            top: `${dropdownPos.top}px`,
            right: `${dropdownPos.right}px`,
          }}
          className="fixed w-56 bg-white border border-gray-100 shadow-xl rounded-md py-2 z-50 transition-all duration-200"
        >
          <a
            href="#house"
            onClick={() => setIsMenuOpen(false)}
            className="block px-4 py-2.5 text-xs font-medium tracking-widest text-gray-800 hover:bg-amber-50 hover:text-amber-800 transition-colors"
          >
            THE HOUSE OF KOTHARIS
          </a>
          <a
            href="#high-jewellery"
            onClick={() => setIsMenuOpen(false)}
            className="block px-4 py-2.5 text-xs font-medium tracking-widest text-gray-800 hover:bg-amber-50 hover:text-amber-800 transition-colors"
          >
            HIGH JEWELLERY
          </a>
        </div>
      )}
    </>
  );
};

export default Navbar;
