import { Head, Link, router } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import Pagination from '@/components/Pagination'
import Navbar from '@/components/aftab-components/Navbar'
import Footer from '@/components/aftab-components/Footer'
import { ChevronLeft, ChevronRight, Heart, X, ChevronDown, Filter, ArrowUpDown } from 'lucide-react'

// Keep your existing interfaces
interface ProductImage {
  id: number
  product_id: number
  src: string
  is_primary: boolean
  position: number
}

interface Product {
  id: number
  title: string
  slug: string
  short_description: string
  price: string
  currency: string
  formatted_price: string
  images_count: number
  images: ProductImage[]
  primary_image: ProductImage
  categories: Category[]
}

interface Category {
  id: number
  name: string
  slug: string
}

interface PaginatedProducts {
  data: Product[]
  links: any[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}

interface Props {
  products: PaginatedProducts
  categories: Category[]
  filters: {
    category: string
    search: string
    min_price: string
    max_price: string
    sort: string
  }
}

// Product Card Component (unchanged)
const ProductCard = ({ product }: { product: Product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const images = product.images || [];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Function to properly format image source
  const getImageSrc = (src: string) => {
    // Check if src is already a full URL
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }
    // Otherwise, prepend the base path
    return `/${src}`;
  };

  return (
    <Link
      href={`/products/${product.categories[0]?.slug || 'uncategorized'}/${product.slug}`}
      className={`group block bg-white flex flex-col transition-all duration-300 overflow-hidden relative ${isHovered ? 'border-1 border-gray-600' : 'border border-transparent'
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        {/* Images Container */}
        <div className="w-full h-full relative">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-opacity duration-500 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <img
                src={getImageSrc(image.src)}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* NEW Badge */}
        {product.id % 3 === 0 && (
          <div className="absolute top-4 left-4 bg-white px-3 py-1.5 text-xs font-medium tracking-wider">
            NEW
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`
            absolute cursor-pointer top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md
            hover:scale-110 transition-all duration-300
            opacity-100 sm:opacity-100 lg:opacity-0 lg:group-hover:opacity-100
          `}
          aria-label="Add to favorites"
        >
          <Heart
            size={18}
            className={`${isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-900'}`}
          />
        </button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className={`absolute cursor-pointer left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-300
                opacity-100 sm:opacity-100 lg:${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
              `}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="text-gray-900" />
            </button>

            <button
              onClick={handleNextImage}
              className={`absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-300
                opacity-100 sm:opacity-100 lg:${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
              `}
              aria-label="Next image"
            >
              <ChevronRight size={20} className="text-gray-900" />
            </button>
          </>
        )}

        {/* Progress Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div
              className="h-full bg-gray-900 transition-all duration-300 ease-out"
              style={{
                width: `${100 / images.length}%`,
                transform: `translateX(${currentImageIndex * 100}%)`,
              }}
            />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="py-6 pb-3 px-3 text-center flex flex-col justify-between flex-1">
       
        <div>
          <h3 className="text-sm font-normal tracking-wide text-gray-900 mb-1 uppercase">
            {product.title}
          </h3>

          {product.categories[0] && (
            <div className=" text-black px-3 py-2 text-xs font-medium tracking-wider">
              {product.categories[0].name.toUpperCase()}
            </div>
          )}

          <p className="text-base font-normal text-gray-900 mb-4">{product.formatted_price}</p>
        </div>

        {/* Select Size Button */}
        <button
          className={`w-full bg-black text-white cursor-pointer py-3 text-xs font-medium tracking-wider transition-all duration-300
            opacity-100 sm:opacity-100 lg:${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
          `}
        >
          View More
        </button>
      </div>
    </Link>
  );
};

// Filter Modal Component for Mobile
const FilterModal = ({
  isOpen,
  onClose,
  categories,
  filters,
  setFilters,
  applyFilters
}: {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  filters: any
  setFilters: (filters: any) => void
  applyFilters: () => void
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50 relative">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Filters</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                style={{ color: '#000000' }}
                placeholder="Search products..."
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                style={{ color: '#000000' }}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={filters.min_price}
                  onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                  placeholder="Min"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  style={{ color: '#000000' }}
                />
                <input
                  type="number"
                  value={filters.max_price}
                  onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                  placeholder="Max"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  style={{ color: '#000000' }}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => {
                applyFilters();
                onClose();
              }}
            >
              Apply Filters
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => {
                setFilters({
                  search: '',
                  category: '',
                  min_price: '',
                  max_price: ''
                });
              }}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sort Modal Component for Mobile
const SortModal = ({
  isOpen,
  onClose,
  sortOption,
  setSortOption,
  applySort
}: {
  isOpen: boolean
  onClose: () => void
  sortOption: string
  setSortOption: (option: string) => void
  applySort: () => void
}) => {
  if (!isOpen) return null;

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name A-Z' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50 relative">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Sort By</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-2">
              {sortOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`sort-${option.value}`}
                    name="sort-option"
                    type="radio"
                    checked={sortOption === option.value}
                    onChange={() => setSortOption(option.value)}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300"
                  />
                  <label htmlFor={`sort-${option.value}`} className="ml-3 block text-sm font-medium text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => {
                applySort();
                onClose();
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProductsIndex({ products, categories, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '')
  const [selectedCategory, setSelectedCategory] = useState(filters.category || '')
  const [minPrice, setMinPrice] = useState(filters.min_price || '')
  const [maxPrice, setMaxPrice] = useState(filters.max_price || '')
  const [sortOption, setSortOption] = useState(filters.sort || 'newest')
  const [navHeight, setNavHeight] = useState(0)

  // Mobile modal states
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isSortModalOpen, setIsSortModalOpen] = useState(false)

  // Desktop sidebar states - now separate for filters and sort
  const [isFilterSectionOpen, setIsFilterSectionOpen] = useState(true)
  const [isSortSectionOpen, setIsSortSectionOpen] = useState(true)

  // Filter state for mobile modals
  const [mobileFilters, setMobileFilters] = useState({
    search: filters.search || '',
    category: filters.category || '',
    min_price: filters.min_price || '',
    max_price: filters.max_price || ''
  });

  // Safety check for products data
  if (!products || !products.data) {
    return <div>Loading...</div>
  }

  const handleSearch = () => {
    router.get('/products', {
      search: search || undefined,
      category: selectedCategory || undefined,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      sort: sortOption || undefined,
    }, {
      preserveState: true,
      replace: true
    })
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('')
    setMinPrice('')
    setMaxPrice('')
    setSortOption('newest')
    router.get('/products', {
      sort: 'newest'
    }, {
      preserveState: true,
      replace: true
    })
  }

  const applyMobileFilters = () => {
    setSearch(mobileFilters.search)
    setSelectedCategory(mobileFilters.category)
    setMinPrice(mobileFilters.min_price)
    setMaxPrice(mobileFilters.max_price)

    router.get('/products', {
      search: mobileFilters.search || undefined,
      category: mobileFilters.category || undefined,
      min_price: mobileFilters.min_price || undefined,
      max_price: mobileFilters.max_price || undefined,
      sort: sortOption || undefined,
    }, {
      preserveState: true,
      replace: true
    })
  }

  const applySort = () => {
    router.get('/products', {
      search: search || undefined,
      category: selectedCategory || undefined,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      sort: sortOption || undefined,
    }, {
      preserveState: true,
      replace: true
    })
  }

  // Count active filters
  const activeFiltersCount = [
    search,
    selectedCategory,
    minPrice,
    maxPrice,
    sortOption !== 'newest' ? sortOption : ''
  ].filter(Boolean).length;

  return (
    <>
      <Navbar setNavHeight={setNavHeight} />
      <Head title="Products" />

      <div className="min-h-screen bg-white">
        <div style={{ paddingTop: `${navHeight}px` }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center flex-wrap gap-1.5 md:gap-2 text-sm text-gray-600">
              <Link href="/" className="text-gray-900 hover:text-red-400 transition-colors">
                Home
              </Link>
              <span className="text-lg">›</span>
              <Link href="/products" className="text-gray-900 hover:text-red-400 transition-colors">
                Products
              </Link>
            </nav>
          </div>

          {/* Mobile Filter and Sort Buttons */}
          <div className="lg:hidden flex justify-between items-center mb-6">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white"
            >
              <Filter size={16} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-black rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsSortModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white"
            >
              <ArrowUpDown size={16} />
              Sort
            </button>
          </div>

          <div className="flex flex-col mt-4 lg:flex-row gap-8">
            {/* Desktop Filters Sidebar - Cartier Style with Separate Dropdowns */}
            <div className="hidden lg:block lg:w-1/4">
              <div className="sticky top-24">
                {/* Filters Section */}
                <div className=" p-2.5 border-b border-gray-300">
                  <div onClick={() => setIsFilterSectionOpen(!isFilterSectionOpen)} className="flex justify-between  cursor-pointer items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <ChevronDown className={`h-5 w-5 transform transition-transform ${isFilterSectionOpen ? '' : 'rotate-180'}`} />
                    </button>
                  </div>

                  {isFilterSectionOpen && (
                    <div className="space-y-8">
                      {/* Search */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Search</h3>
                        <input
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                          className="w-full px-3 py-2 border-b text-xs border-gray-300 focus:outline-none focus:border-black"
                          style={{ color: '#000000' }}
                          placeholder="Search products..."
                        />
                      </div>

                      {/* Category Filter */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
                        <ul className="space-y-2">
                          <li>
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="category"
                                checked={!selectedCategory}
                                onChange={() => setSelectedCategory('')}
                                className="h-4 w-4 text-black focus:ring-black border-gray-300"
                              />
                              <span className="ml-2 text-sm text-gray-700">All Categories</span>
                            </label>
                          </li>
                          {categories.map((category) => (
                            <li key={category.id}>
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name="category"
                                  checked={selectedCategory === category.slug}
                                  onChange={() => setSelectedCategory(category.slug)}
                                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Price Range */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                        <div className="space-y-3">
                          <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Min Price"
                            className="w-full px-3 py-2 text-xs border-b border-gray-300 focus:outline-none focus:border-black"
                            style={{ color: '#000000' }}
                          />
                          <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Max Price"
                            className="w-full px-3 text-xs py-2 border-b border-gray-300 focus:outline-none focus:border-black"
                            style={{ color: '#000000' }}
                          />
                        </div>
                      </div>

                      {/* Filter Buttons */}
                      <div className="space-y-3 pt-4">
                        <button
                          onClick={handleSearch}
                          className="w-full bg-black text-white py-2 px-4 rounded-sm hover:bg-gray-800 transition-colors"
                        >
                          Apply Filters
                        </button>
                        <button
                          onClick={clearFilters}
                          className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-sm hover:bg-gray-50 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sort Section */}
                <div className="p-2.5">
                  <div onClick={() => setIsSortSectionOpen(!isSortSectionOpen)} className="flex justify-between items-center mb-6 cursor-pointer">
                    <h2 className="text-lg font-semibold text-gray-900">Sort By</h2>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <ChevronDown className={`h-5 w-5 transform transition-transform ${isSortSectionOpen ? '' : 'rotate-180'}`} />
                    </button>
                  </div>

                  {isSortSectionOpen && (
                    <div className="space-y-2">
                      <div>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="sort"
                            checked={sortOption === 'newest'}
                            onChange={() => {
                              setSortOption('newest');
                              applySort();
                            }}
                            className="h-4 w-4 text-black focus:ring-black border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Newest First</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="sort"
                            checked={sortOption === 'price-low'}
                            onChange={() => {
                              setSortOption('price-low');
                              applySort();
                            }}
                            className="h-4 w-4 text-black focus:ring-black border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Price: Low to High</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="sort"
                            checked={sortOption === 'price-high'}
                            onChange={() => {
                              setSortOption('price-high');
                              applySort();
                            }}
                            className="h-4 w-4 text-black focus:ring-black border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Price: High to Low</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="sort"
                            checked={sortOption === 'name'}
                            onChange={() => {
                              setSortOption('name');
                              applySort();
                            }}
                            className="h-4 w-4 text-black focus:ring-black border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Name A-Z</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              {/* Results Count and Desktop Sort */}
              <div className="flex justify-end items-center mb-6">
                <p className="text-gray-600">
                  Showing {products.data.length} of {products.meta?.total ?? products.data.length} products
                </p>
              </div>

              {products.data.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.data.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {products.data.length > 0 && products.meta && products.links && (
                <Pagination links={products.links} meta={products.meta} />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Mobile Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        categories={categories}
        filters={mobileFilters}
        setFilters={setMobileFilters}
        applyFilters={applyMobileFilters}
      />

      {/* Mobile Sort Modal */}
      <SortModal
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        sortOption={sortOption}
        setSortOption={setSortOption}
        applySort={applySort}
      />
    </>
  )
}