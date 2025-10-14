import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Menu, X, Search, MapPin, ShoppingBag, User, ConciergeBell } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react'

interface NavItem {
    label: string;
    href: string;
}

interface NavbarProps {
    setNavHeight?: (height: number) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setNavHeight }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    const mainNavItems: NavItem[] = [
        { label: 'HIGH JEWELLERY', href: '#high-jewellery' },
        { label: 'FINE JEWELLERY', href: '#fine-jewellery' },
        { label: 'WEDDING', href: '#wedding' },
        { label: 'BESPOKE', href: '#bespoke' },
    ];

    const sidebarItems: NavItem[] = [
        { label: 'High Jewellery', href: '#high-jewellery' },
        { label: 'Fine Jewellery', href: '#fine-jewellery' },
        { label: 'Wedding', href: '#wedding' },
        { label: 'Bespoke', href: '#bespoke' },
        { label: 'Contact Us', href: '#contact' },
        { label: 'DM News', href: '#news' },
        { label: 'Our Boutiques', href: '#boutiques' },
        { label: 'Our Heritage', href: '#heritage' },
        { label: 'Delivery & Returns', href: '#delivery' },
    ];

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useLayoutEffect(() => {

        if (!navRef.current) return

    const updateHeight = () => {
      if (navRef.current && setNavHeight) {
        const height = navRef.current.offsetHeight;
        setNavHeight(height);
      }
    };

    // Initial height calculation
    updateHeight();

    // Update height on window resize
    window.addEventListener('resize', updateHeight);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
    }, [setNavHeight, navRef.current]);

    return (
        <>
            {/* Desktop Navbar */}
            <nav ref={navRef} className=" border-b font-jost bg-white border-gray-200 w-full z-50  p-4 fixed top-0 left-0">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
                    <div className="flex items-center justify-between h-fit">
                        {/* Left Navigation - Hidden on mobile/tablet */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {mainNavItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="text-sm lg:text-xs xl:text-sm font-normal text-center tracking-wide text-gray-800 hover:text-gray-600 transition-colors"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>

                        
                        {/* Mobile Search Icon */}
                        <button className="lg:hidden p-2 text-gray-800">
                            <Search size={20} />
                        </button>

                        

                        {/* Center Logo */}
                        <Link href="/products" className="flex items-center">
                            <img
                                className="w-[150px] h-auto"
                                src="/media/logo.webp"
                                alt="Kothari Fine Jewels"
                            />
                        </Link>

                        {/* Right Icons - Hidden on mobile, visible on tablet+ */}
                        <div className="hidden lg:flex items-center space-x-4">
                            <a
                                href="#house"
                                className="text-sm lg:text-xs xl:text-sm text-center font-normal tracking-wide text-gray-800 hover:text-gray-600 transition-colors hidden lg:block"
                            >
                                THE HOUSE OF KOTHARIS
                            </a>
                            <button className="p-2 text-gray-800 hover:text-gray-600 transition-colors">
                                
                                <ConciergeBell size={18} />
                            </button>
                            <button className="p-2 text-gray-800 hover:text-gray-600 transition-colors">
                                <Search size={18} />
                            </button>
                            <button className="p-2 text-gray-800 hover:text-gray-600 transition-colors">
                                <MapPin size={18} />
                            </button>
                            <button className="p-2 text-gray-800 hover:text-gray-600 transition-colors">
                                <ShoppingBag size={18} />
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

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-4/5 md:w-1/2 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <Link href="/products" className="flex items-center">
                            <img
                                className="w-[130px] h-auto"
                                src="/media/logo.webp"
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
                                className={`flex items-center justify-between px-6 py-4 text-gray-800 hover:bg-gray-50 transition-colors ${index < 4 ? 'border-b border-gray-100' : ''
                                    } ${index === 4 ? 'mt-4' : ''}`}
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