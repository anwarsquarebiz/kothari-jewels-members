import { Link, usePage } from '@inertiajs/react'
import { ReactNode, useState } from 'react'
import { User } from '@/types'

interface Props {
  children: ReactNode
}

export default function EcommerceLayout({ children }: Props) {
  const { auth } = usePage().props as { auth: { user: User } }
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/products" className="flex items-center">
                <img
                  className="h-8 w-auto"
                  src="/media/logo.webp"
                  alt="Kothari Fine Jewels"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link
                href="/products"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Collection
              </Link>
              <Link
                href="/products?category=rings"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Rings
              </Link>
              <Link
                href="/products?category=necklaces"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Necklaces
              </Link>
              <Link
                href="/products?category=earrings"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Earrings
              </Link>
              <Link
                href="/products?category=bracelets"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Bracelets
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* User menu */}
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Welcome, {auth.user.name}</span>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    {auth.user.roles?.map((role) => (
                      <span key={role.id} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                        {role.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/products"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Collection
              </Link>
              <Link
                href="/products?category=rings"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Rings
              </Link>
              <Link
                href="/products?category=necklaces"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Necklaces
              </Link>
              <Link
                href="/products?category=earrings"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Earrings
              </Link>
              <Link
                href="/products?category=bracelets"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bracelets
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Contact Us */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2 text-sm">
                <p>Kothari Fine Jewels</p>
                <p>1A Raj Mahal, 33 Altamount Road</p>
                <p>Mumbai, India</p>
                <p>Tel: +91 22 2353 5800</p>
                <p>Tel: +91 98205 15907</p>
                <p>Email: ami@kfjewels.com</p>
              </div>
            </div>

            {/* Customer Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Services</h3>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block hover:text-gray-300">Contact Us</Link>
                <Link href="#" className="block hover:text-gray-300">Track Your Order</Link>
                <Link href="#" className="block hover:text-gray-300">Product Care & Repair</Link>
                <Link href="#" className="block hover:text-gray-300">Book an Appointment</Link>
                <Link href="#" className="block hover:text-gray-300">FAQ</Link>
                <Link href="#" className="block hover:text-gray-300">Shipping & Returns</Link>
              </div>
            </div>

            {/* About Us */}
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block hover:text-gray-300">About Us</Link>
                <Link href="#" className="block hover:text-gray-300">FAQ</Link>
                <Link href="#" className="block hover:text-gray-300">Our Heritage</Link>
                <Link href="#" className="block hover:text-gray-300">Terms & Conditions</Link>
                <Link href="#" className="block hover:text-gray-300">Privacy Policy</Link>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/kotharifinejewels/" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Kothari Fine Jewels. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
