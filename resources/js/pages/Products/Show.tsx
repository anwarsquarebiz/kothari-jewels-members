import { Head, Link } from '@inertiajs/react'
import { useState } from 'react'

interface Product {
  id: number
  title: string
  slug: string
  short_description: string
  long_description: string
  sku: string
  price: string
  currency: string
  formatted_price: string
  images: ProductImage[]
  categories: Category[]
  details: ProductDetail[]
  active_details: ProductDetail[]
}

interface ProductImage {
  id: number
  src: string
  is_primary: boolean
  position: number
}

interface ProductDetail {
  id: number
  title: string
  subtitle: string
  image: string
  position: number
  is_active: boolean
}

interface Category {
  id: number
  name: string
  slug: string
}

interface RelatedProduct {
  id: number
  title: string
  slug: string
  primary_image_url: string
  categories: Category[]
}

interface Props {
  product: Product
  category: Category
  relatedProducts: RelatedProduct[]
}

export default function ProductShow({ product, category, relatedProducts }: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showContactModal, setShowContactModal] = useState(false)

  const primaryImage = product.images.find(img => img.is_primary) || product.images[0]

  return (
    <>
      <Head title={product.title} />
      
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Home
              </Link>
              <span>›</span>
              <Link href="/products" className="hover:text-gray-900 transition-colors">
                Products
              </Link>
              <span>›</span>
              <span className="text-gray-900 font-medium">{product.title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images[selectedImageIndex]?.src || primaryImage?.src}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? 'border-blue-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Image Navigation Dots */}
              {product.images.length > 1 && (
                <div className="flex justify-center space-x-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        selectedImageIndex === index ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.title}
                </h1>
                
                {product.short_description && (
                  <div className="text-gray-600 mb-4">
                    <p>{product.short_description}</p>
                  </div>
                )}

                {product.long_description && (
                  <div className="text-gray-600 mb-4">
                    <p>{product.long_description}</p>
                  </div>
                )}

                <div className="text-sm text-gray-500 mb-4">
                  SKU: {product.sku}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between py-4 border-t border-b border-gray-200">
                <div className="text-3xl font-bold text-gray-900">
                  {product.formatted_price}
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Contact Button */}
              <button
                onClick={() => setShowContactModal(true)}
                className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg"
              >
                ENQUIRE NOW
              </button>

              <div className="text-xs text-gray-500 text-center">
                *MRP (inclusive of all taxes)
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          {product.active_details.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                Details of the piece
              </h2>

              <div className="text-center mb-8">
                <button className="text-blue-600 hover:text-blue-800 underline font-semibold">
                  OUR STONE GUIDE
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {product.active_details.map((detail) => (
                  <div key={detail.id} className="text-center">
                    {detail.image && (
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                        <img
                          src={detail.image}
                          alt={detail.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-900 uppercase mb-2">
                      {detail.title}
                    </h3>
                    {detail.subtitle && (
                      <p className="text-gray-600 text-sm">
                        {detail.subtitle}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Information */}
          <div className="mt-12 bg-gray-50 rounded-lg p-8">
            <ul className="space-y-2 text-gray-600">
              <li>• All gemstones are sourced and selected by a member of the family.</li>
              <li>• Diamonds used are typically F-H color, VVS - VS quality unless otherwise specified.</li>
              <li>• Color Stones' origin and quality as stated</li>
            </ul>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">More For You</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Drawing inspiration from the dance of precious stones, here are more pieces we think you'd enjoy
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.categories[0]?.slug || 'uncategorized'}/${relatedProduct.slug}`}
                    className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                  >
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      <img
                        src={relatedProduct.primary_image_url}
                        alt={relatedProduct.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {relatedProduct.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Arrange a Viewing</h3>
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Telephone Number
                      </label>
                      <input
                        type="tel"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product
                      </label>
                      <input
                        type="text"
                        value={product.title}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Viewing Date
                      </label>
                      <input
                        type="date"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Viewing Time
                      </label>
                      <input
                        type="time"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Type
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="in-person">In person</option>
                      <option value="virtual">Virtual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Write your message here..."
                    />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t flex justify-end space-x-3">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
                  Submit Enquiry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
