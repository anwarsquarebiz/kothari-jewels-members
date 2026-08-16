import React, { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  Search,
  MapPin,
  ShoppingBag,
  User,
  ConciergeBell,
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  setNavHeight?: (height: number) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setNavHeight }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; right: number }>({
    top: 80,
    right: 16,
  });

  const navRef = useRef<HTMLElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const sidebarItems: NavItem[] = [
    { label: "High Jewellery", href: "#high-jewellery" },
    { label: "Fine Jewellery", href: "#fine-jewellery" },
    { label: "Wedding", href: "#wedding" },
    { label: "Bespoke", href: "#bespoke" },
    { label: "Contact Us", href: "#contact" },
    { label: "DM News", href: "#news" },
    { label: "Our Boutiques", href: "#boutiques" },
    { label: "Our Heritage", href: "#heritage" },
    { label: "Delivery & Returns", href: "#delivery" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const updateDropdownPos = () => {
    if (menuButtonRef.current) {
      const buttonRect = menuButtonRef.current.getBoundingClientRect();
      const rightOffset = window.innerWidth - buttonRect.right;
      const topOffset = buttonRect.bottom + 5;
      setDropdownPos({ top: topOffset, right: rightOffset });
    }
  };

  const toggleDesktopMenu = () => {
    if (!isDesktopMenuOpen) {
      updateDropdownPos();
    }
    setIsDesktopMenuOpen((prev) => !prev);
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
    if (isDesktopMenuOpen) {
      updateDropdownPos();
      window.addEventListener("resize", updateDropdownPos);
      window.addEventListener("scroll", updateDropdownPos);
      return () => {
        window.removeEventListener("resize", updateDropdownPos);
        window.removeEventListener("scroll", updateDropdownPos);
      };
    }
  }, [isDesktopMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        setIsDesktopMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <nav
        ref={navRef}
        className="border-b border-gray-200 w-full mx-auto px-4 z-50 bg-white p-4 fixed top-0 left-0"
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex items-center justify-between h-fit">
            {/* Mobile Search Icon */}
            <button className="lg:hidden p-2 text-gray-800" aria-label="Search">
              <Search size={20} />
            </button>

            {/* Mobile Center Logo */}
            <Link href="/products" className="flex items-center lg:hidden">
              <img
                className="w-[70px] sm:w-[85px] h-auto object-contain"
                src="/media/kothari-1937-logo.svg"
                alt="Kothari Fine Jewels"
              />
            </Link>

            {/* Desktop Left Logo */}
            <div className="hidden lg:flex items-center">
              <Link href="/products">
                <img
                  className="w-[85px] lg:w-[105px] h-auto object-contain transition-all duration-200"
                  src="/media/kothari-1937-only-logo.svg"
                  alt="Kothari Fine Jewels Logo"
                />
              </Link>
            </div>

            {/* Desktop Center Text Logo SVG */}
            <div className="hidden lg:flex items-center justify-center">
              <Link href="/products">
                <img
                  className="h-8 md:h-10 w-auto max-w-[280px] object-contain"
                  src="/media/kothari-1937-only-text.svg"
                  alt="Kothari 1937"
                />
              </Link>
            </div>

            {/* Desktop Right Icons & Menu Button */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Shopping Bag Icon on Left of Menu Icon */}
              {/* <button
                className="p-2 text-gray-800 hover:text-amber-700 transition-colors"
                aria-label="Shopping Bag"
              >
                <ShoppingBag size={20} />
              </button> */}

              {/* Side Menu Icon Button */}
              <button
                ref={menuButtonRef}
                onClick={toggleDesktopMenu}
                className="p-2 text-gray-800 hover:text-amber-700 transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                <Menu size={22} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-gray-800"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Desktop Dropdown Menu (Positioned 5px below navbar, aligned horizontally under menu button) */}
      {isDesktopMenuOpen && (
        <div
          ref={desktopMenuRef}
          style={{
            top: `${dropdownPos.top}px`,
            right: `${dropdownPos.right}px`,
          }}
          className="hidden lg:block fixed w-56 bg-white border border-gray-100 shadow-xl rounded-md py-2 z-50 transition-all duration-200"
        >
          <a
            href="#house"
            onClick={() => setIsDesktopMenuOpen(false)}
            className="block px-4 py-2.5 text-xs font-medium tracking-widest text-gray-800 hover:bg-amber-50 hover:text-amber-800 transition-colors"
          >
            THE HOUSE OF KOTHARIS
          </a>
          <a
            href="#high-jewellery"
            onClick={() => setIsDesktopMenuOpen(false)}
            className="block px-4 py-2.5 text-xs font-medium tracking-widest text-gray-800 hover:bg-amber-50 hover:text-amber-800 transition-colors"
          >
            HIGH JEWELLERY
          </a>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-4/5 md:w-1/2 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link href="/products" className="flex items-center">
              <img
                className="w-[70px] sm:w-[85px] h-auto object-contain"
                src="/media/kothari-1937-logo.svg"
                alt="Kothari Fine Jewels"
              />
            </Link>
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-800"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {sidebarItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-6 py-4 text-gray-800 hover:bg-gray-50 transition-colors ${
                  index < 4 ? "border-b border-gray-100" : ""
                } ${index === 4 ? "mt-4" : ""}`}
                onClick={toggleSidebar}
              >
                <span className="text-base font-light">{item.label}</span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;



