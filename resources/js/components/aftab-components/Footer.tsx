import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

interface FooterLink {
    label: string;
    href: string;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

const Footer: React.FC = () => {
    const footerSections: FooterSection[] = [
        {
            title: 'CUSTOMER SERVICES',
            links: [
                { label: 'Contact Us', href: '#contact' },
                { label: 'Track Your Order', href: '#track' },
                { label: 'Product Care & Repair', href: '#care' },
                { label: 'Book an Appointment', href: '#appointment' },
                { label: 'Frequently Asked Questions', href: '#faq' },
                { label: 'Shipping & Returns', href: '#shipping' },
            ],
        },
        {
            title: 'ABOUT US',
            links: [
                { label: 'About Us', href: '#about' },
                { label: 'FAQ', href: '#faq' },
                { label: 'Our Producers', href: '#producers' },
                { label: 'Sitemap', href: '#sitemap' },
                { label: 'Terms & Conditions', href: '#terms' },
                { label: 'Privacy Policy', href: '#privacy' },
            ],
        },
        {
            title: 'CATALOG',
            links: [
                { label: 'Earrings', href: '#earrings' },
                { label: 'Necklaces', href: '#necklaces' },
                { label: 'Bracelets', href: '#bracelets' },
                { label: 'Rings', href: '#rings' },
                { label: 'Jewelry Box', href: '#jewelry-box' },
                { label: 'Studs', href: '#studs' },
            ],
        },
    ];

    return (
        <footer className="bg-[#1a1a1a] text-white font-jost">
            <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    
                    <div>
                        <h3 className="text-base font-semibold mb-6 tracking-wide">CONTACT US</h3>
                        <div className="space-y-4 text-sm font-lato">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="flex-shrink-0 mt-1" />
                                <p className="leading-relaxed">
                                    Visit us at: Kothari Fine Jewels, 1A Raj Mahal, 33 Altamount Road, Mumbai
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <Phone size={18} className="flex-shrink-0" />
                                    <a href="tel:+912222535800" className="hover:text-gray-300 transition-colors">
                                        Tel: +91 22 2353 5800
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={18} className="flex-shrink-0" />
                                    <a href="tel:+919820515907" className="hover:text-gray-300 transition-colors">
                                        Tel: +91 98205 15907
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail size={18} className="flex-shrink-0" />
                                <a href="mailto:ami@kfjewels.com" className="hover:text-gray-300 transition-colors">
                                    Email: ami@kfjewels.com
                                </a>
                            </div>

                            
                            <div className="flex items-center gap-3 pt-4">
                                <a
                                    href="#facebook"
                                    className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                                    aria-label="Facebook"
                                >
                                    <Facebook size={18} />
                                </a>
                                <a
                                    href="#instagram"
                                    className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                                    aria-label="Instagram"
                                >
                                    <Instagram size={18} />
                                </a>
                                <a
                                    href="#twitter"
                                    className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                                    aria-label="Twitter"
                                >
                                    <Twitter size={18} />
                                </a>
                                <a
                                    href="#youtube"
                                    className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                                    aria-label="YouTube"
                                >
                                    <Youtube size={18} />
                                </a>
                            </div>
                        </div>
                    </div>

                    
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-base font-semibold mb-6 tracking-wide">{section.title}</h3>
                            <ul className="space-y-3 font-lato text-sm">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="hover:text-gray-300 transition-colors inline-block"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            
            <div className="border-t border-gray-700">
                <div className="container mx-auto px-4 lg:px-6 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-gray-400">
                            Copyright © 2023. All Right Reserved
                        </p>

                        {/* Payment Methods */}
                        <div className="flex items-center gap-3 flex-wrap justify-center">
                            <img src="/media/payments.png" className="w-full md:w-3/5 lg:w-4/5" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;