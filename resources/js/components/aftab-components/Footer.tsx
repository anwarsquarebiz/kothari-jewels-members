import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface FooterLink {
    label: string;
    href: string;
}

const catalogLinks: FooterLink[] = [
    { label: 'Earrings', href: '/products?category=earrings' },
    { label: 'Necklaces', href: '/products?category=necklaces' },
    { label: 'Bracelets', href: '/products?category=bracelets' },
    { label: 'Rings', href: '/products?category=rings' },
];

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#1a1a1a] text-white font-jost">
            <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
                <div className="flex flex-col md:flex-row md:justify-between gap-12 lg:gap-24">
                    <div>
                        <h3 className="text-base font-semibold mb-6 tracking-wide">CONTACT US</h3>
                        <div className="space-y-4 text-sm font-lato text-gray-200">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="flex-shrink-0 mt-1" />
                                <p className="leading-relaxed">
                                    Visit us at: Kothari Fine Jewels, 1A Raj Mahal, 33 Altamount Road, Mumbai
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <Phone size={18} className="flex-shrink-0" />
                                    <a href="tel:+912222535800" className="hover:text-white transition-colors">
                                        Tel: +91 22 2353 5800
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={18} className="flex-shrink-0" />
                                    <a href="tel:+919820515907" className="hover:text-white transition-colors">
                                        Tel: +91 98205 15907
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail size={18} className="flex-shrink-0" />
                                <a href="mailto:ami@kfjewels.com" className="hover:text-white transition-colors">
                                    Email: ami@kfjewels.com
                                </a>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <a
                                    href="#facebook"
                                    className="w-10 h-10 rounded-full border border-white/80 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                                    aria-label="Facebook"
                                >
                                    <Facebook size={18} />
                                </a>
                                <a
                                    href="#instagram"
                                    className="w-10 h-10 rounded-full border border-white/80 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                                    aria-label="Instagram"
                                >
                                    <Instagram size={18} />
                                </a>
                                <a
                                    href="#twitter"
                                    className="w-10 h-10 rounded-full border border-white/80 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                                    aria-label="Twitter"
                                >
                                    <Twitter size={18} />
                                </a>
                                <a
                                    href="#youtube"
                                    className="w-10 h-10 rounded-full border border-white/80 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                                    aria-label="YouTube"
                                >
                                    <Youtube size={18} />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold mb-6 tracking-wide">CATALOG</h3>
                        <ul className="space-y-3 font-lato text-sm text-gray-200">
                            {catalogLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-white transition-colors inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700">
                <div className="container mx-auto px-4 lg:px-6 py-6">
                    <p className="text-xs text-gray-400 text-center">
                        Copyright © 2023. All Right Reserved
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
