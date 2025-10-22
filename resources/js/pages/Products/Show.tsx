import Navbar from "@/components/aftab-components/Navbar";
import Footer from "@/components/aftab-components/Footer";

import { Head, Link } from "@inertiajs/react";
import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronRight, ChevronLeft, X } from "lucide-react";

// Import GSAP for scroll animations
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Product {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  sku: string;
  price: string;
  currency: string;
  formatted_price: string;
  images: ProductImage[];
  categories: Category[];
  details: ProductDetail[];
  active_details: ProductDetail[];
}

interface ProductImage {
  id: number;
  src: string;
  is_primary: boolean;
  position: number;
}

interface ProductDetail {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  position: number;
  is_active: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface RelatedProduct {
  id: number;
  title: string;
  slug: string;
  primary_image_url: string;
  categories: Category[];
}

interface Props {
  product: Product;
  category: Category;
  relatedProducts: RelatedProduct[];
}

// Custom hook for scroll-triggered image gallery
const useScrollGallery = (
  images: ProductImage[],
  navbarHeight: number,
  enabled: boolean,
  wrapperRef: React.RefObject<HTMLDivElement>,
  imageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>,
  imageContainerRef: React.RefObject<HTMLDivElement>
) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!enabled || !wrapperRef.current || images.length <= 1) return;

    const wrapper = wrapperRef.current;
    const imageElements = imageRefs.current.filter(Boolean);

    // Set initial state - first image visible, others below
    gsap.set(imageElements[0], { y: 0, opacity: 1 });
    gsap.set(imageElements.slice(1), { y: "100%", opacity: 1 });

    // Calculate total scroll distance needed - reduced for better control
    const scrollDistance = (images.length - 1) * window.innerHeight * 0.5;

    // Create ScrollTrigger that pins the entire wrapper
    // Start pinning when breadcrumb goes just under navbar (navbarHeight + 45px for breadcrumb padding + 20px for breadcrumb height)
    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: `top ${navbarHeight + 65}px`, // 45px breadcrumb padding + 20px breadcrumb height
      end: `+=${(images.length - 1) * window.innerHeight}`,
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        if (!imageContainerRef.current) return;

        const index = Math.min(
          Math.floor(self.progress * images.length),
          images.length - 1
        );
        setCurrentIndex(index);

        // Snap container translation
        gsap.to(imageContainerRef.current, {
          y: `-${index * window.innerHeight}px`,
          duration: 0.3,
          ease: "power2.out",
        });
      },
    });

    scrollTriggerRef.current = st;

    // Cleanup
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      // Reset animations on cleanup
      gsap.set(imageElements, { clearProps: "all" });
    };
  }, [images, navbarHeight, enabled, wrapperRef, imageRefs]);

  // Function to scroll to a specific image
  const scrollToImage = (index: number) => {
    if (!scrollTriggerRef.current || !enabled) return;

    // Calculate the scroll position for the target image
    // Add a small offset to ensure we're not at the exact boundary
    const progress = Math.max(0.01, (index + 0.5) / images.length);
    scrollTriggerRef.current.scroll(progress);
  };

  return { currentIndex, scrollToImage };
};

// Helper function to properly format image sources
const getImageSrc = (src: string) => {
  // If it's already a full URL, return as is
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // If it starts with a slash already, return as is
  if (src.startsWith("/")) {
    return src;
  }

  // For relative paths, ensure they start from the root
  return `/${src}`;
};

export default function ProductShow({
  product,
  category,
  relatedProducts,
}: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const mobileImageRef = useRef<HTMLDivElement>(null);
  const mobileImagesRef = useRef<(HTMLDivElement | null)[]>([]);

  const prevRefMore = useRef<HTMLButtonElement>(null);
  const nextRefMore = useRef<HTMLButtonElement>(null);

  // 🧭 Refs for second swiper
  const prevRefExplore = useRef<HTMLButtonElement>(null);
  const nextRefExplore = useRef<HTMLButtonElement>(null);

  // Refs for scroll gallery
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const imageContainerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    appointmentType: "in-person",
    message: "",
  });

  const primaryImage =
    product.images.find((img) => img.is_primary) || product.images[0];

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Use scroll gallery hook for large screens
  const { currentIndex, scrollToImage } = useScrollGallery(
    product.images,
    navHeight,
    isLargeScreen,
    wrapperRef,
    imageRefs,
    imageContainerRef
  );

  // Sync scroll index with selected index on large screens
  useEffect(() => {
    if (isLargeScreen) {
      setSelectedImageIndex(currentIndex);
    }
  }, [currentIndex, isLargeScreen]);

  // Mobile carousel navigation with slide animation
  const animateToImage = (
    newIndex: number,
    direction: "next" | "prev" | "direct"
  ) => {
    if (isAnimating || newIndex === selectedImageIndex) return;
    setIsAnimating(true);

    const currentImage = mobileImagesRef.current[selectedImageIndex];
    const nextImage = mobileImagesRef.current[newIndex];
    if (!currentImage || !nextImage) {
      setIsAnimating(false);
      return;
    }

    // Make next image visible immediately
    gsap.set(nextImage, { display: "block" });

    if (direction === "next") gsap.set(nextImage, { x: "100%", opacity: 1 });
    else if (direction === "prev")
      gsap.set(nextImage, { x: "-100%", opacity: 1 });
    else gsap.set(nextImage, { x: 0, opacity: 0 });

    // Animate both images simultaneously
    const tl = gsap.timeline({
      onComplete: () => {
        setSelectedImageIndex(newIndex);
        setIsAnimating(false);

        // Hide all other images except the current one
        mobileImagesRef.current.forEach((img, idx) => {
          if (!img) return;
          if (idx !== newIndex)
            gsap.set(img, { x: 0, opacity: 0, display: "none" });
        });
      },
    });

    if (direction === "next") {
      tl.to(
        currentImage,
        { x: "-100%", duration: 0.5, ease: "power2.inOut" },
        0
      ).to(nextImage, { x: "0%", duration: 0.5, ease: "power2.inOut" }, 0);
    } else if (direction === "prev") {
      tl.to(
        currentImage,
        { x: "100%", duration: 0.5, ease: "power2.inOut" },
        0
      ).to(nextImage, { x: "0%", duration: 0.5, ease: "power2.inOut" }, 0);
    } else {
      tl.to(
        currentImage,
        { opacity: 0, duration: 0.3, ease: "power2.inOut" },
        0
      ).to(nextImage, { opacity: 1, duration: 0.3, ease: "power2.inOut" }, 0);
    }
  };

  const handlePrevImage = () => {
    const newIndex =
      selectedImageIndex === 0
        ? product.images.length - 1
        : selectedImageIndex - 1;
    animateToImage(newIndex, "prev");
  };

  const handleNextImage = () => {
    const newIndex =
      selectedImageIndex === product.images.length - 1
        ? 0
        : selectedImageIndex + 1;
    animateToImage(newIndex, "next");
  };

  // Handle bullet click for both mobile and desktop
  const handleBulletClick = (index: number) => {
    if (!imageContainerRef.current) return;
    const container = imageContainerRef.current;

    gsap.to(container, {
      y: `-${index * window.innerHeight}px`,
      duration: 0.5,
      ease: "power2.inOut",
    });

    setSelectedImageIndex(index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setShowContactModal(false);
  };

  // Touch handlers for mobile swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
  };

  const items = Array(3).fill(null);

  const explore = [
    {
      name: "Kothari's Boutique Showroom Altamount Road",
      src: "/media/Showroom 1.jpg",
    },
    {
      name: "Kothari's Boutique Showroom Altamount Road",
      src: "/media/model-square/1.jpg",
    },
    {
      name: "Kothari's Boutique Showroom Altamount Road",
      src: "/media/model-square/2.jpg",
    },
  ];

  const more_section = [
    {
      name: "Kothari's Boutique Showroom Altamount Road",
      src: "/media/product/more-products/3.jpg",
    },
    {
      name: "Kothari's Boutique Showroom Altamount Road",
      src: "/media/product/more-products/4.jpg",
    },
    {
      name: "Kothari's Boutique Showroom Altamount Road",
      src: "/media/product/more-products/5.jpg",
    },
  ];

  return (
    <>
      <Navbar setNavHeight={setNavHeight} />
      <Head title={product.title} />

      <div className="min-h-screen bg-white">
        {/* Breadcrumb - Not fixed, with proper spacing */}
        <div
          className="relative z-10 bg-white border-b border-gray-100"
          style={{ paddingTop: `${navHeight}px` }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center flex-wrap gap-1.5 md:gap-2 text-sm text-gray-600">
              <Link
                href="/"
                className="text-gray-900 hover:text-red-400 transition-colors"
              >
                Home
              </Link>
              <span className="text-lg">›</span>
              <Link
                href="/products"
                className="text-gray-900 hover:text-red-400 transition-colors"
              >
                Products
              </Link>
              <span className="text-lg">›</span>
              <div className="text-gray-900">{product.title}</div>
            </nav>
          </div>
        </div>

        <div className="w-full mx-auto lg:container py-8 lg:px-8">
          {/* Wrapper for scroll-triggered pinning */}
          <div
            ref={wrapperRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8"
          >
            {/* Product Images - Chanel Style */}
            <div className="space-y-4 relative">
              {/* Mobile/Tablet: Swipeable Carousel */}
              <div className="lg:hidden">
                <div
                  ref={mobileImageRef}
                  className="relative aspect-square bg-gray-100 overflow-hidden"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {product.images.map((image, index) => (
                    <div
                      key={image.id}
                      ref={(el) => (mobileImagesRef.current[index] = el)}
                      className={`absolute inset-0 ${
                        index === selectedImageIndex ? "" : "hidden"
                      }`}
                    >
                      <img
                        src={getImageSrc(image.src)} // Use the function here
                        alt={`${product.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
                        aria-label="Next image"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  {/* Dots Indicator */}
                  {product.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handleBulletClick(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            selectedImageIndex === index
                              ? "bg-white w-6"
                              : "bg-white/50"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop: Scroll-triggered Gallery */}
              <div className="hidden lg:block">
                <div className="relative">
                  {/* Stacked Images Container */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <div
                      ref={imageContainerRef}
                      className="relative w-full"
                      style={{ height: `${product.images.length * 100}%` }}
                    >
                      {product.images.map((image, index) => {
                        return (
                          <div
                            key={index}
                            ref={(el) => (imageRefs.current[index] = el)}
                            className="w-full h-screen" // full viewport height for each
                          >
                            <img
                              src={getImageSrc(image.src)} // Use the function here
                              alt={`${product.title} - ${index}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  {product.images.length > 1 && (
                    <div className="flex flex-col justify-center space-y-2 absolute top-1/2 -translate-y-1/2 -left-8">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handleBulletClick(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            selectedImageIndex === index
                              ? "bg-gray-800 h-8"
                              : "bg-gray-300"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6 px-4 sm:px-6 lg:px-0 flex flex-col justify-center">
              <div>
                <div className="w-full mb-4">
                  <h1 className="text-2xl font-bold text-center lg:text-start text-gray-900 mb-2">
                    {product.title}
                  </h1>
                  <div className="w-full bg-black/80 h-1"></div>
                </div>

                {product.short_description && (
                  <div className="text-gray-600 mb-4 text-sm text-center lg:text-start">
                    <p>{product.short_description}</p>
                  </div>
                )}

                {product.long_description && (
                  <div className="text-gray-600 mb-4 text-sm text-center lg:text-start">
                    <p>{product.long_description}</p>
                  </div>
                )}

                <div className="text-sm text-gray-500 mb-4 text-sm text-center lg:text-start">
                  SKU: {product.sku}
                </div>
              </div>

              {/* Price */}
              {product?.price && (
                <div className="flex items-center justify-between py-4 border-t border-b border-gray-200">
                  <div className="text-sm font-semibold text-gray-900">
                    {product?.currency} - {product?.price}
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* Contact Button */}
              <div className="space-y-2.5">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full border border-black text-black font-semibold py-4 px-6 hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer text-xs"
                >
                  ENQUIRE NOW
                </button>

                <div className="text-xs text-gray-500 text-center lg:text-start">
                  *MRP (inclusive of all taxes)
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          {product.active_details.length > 0 && (
            <div className="mt-16 px-4 sm:px-6 lg:px-0">
              <h2 className="text-2xl font-bold text-center text-gray-900 uppercase mb-8">
                Details of the piece
              </h2>

              <div className="text-center mb-8">
                <button className="text-black text-sm underline font-semibold">
                  OUR STONE GUIDE
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {product.active_details.map((detail) => (
                  <div key={detail.id} className="">
                    {detail.image && (
                      <div className="aspect-[16/7] bg-gray-100 overflow-hidden mb-4">
                        <img
                          src={getImageSrc(detail.image)}
                          alt={detail.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-black uppercase text-sm mb-2">
                      {detail.title}
                    </h3>
                    {detail.subtitle && (
                      <p className="text-gray-900 text-xs">{detail.subtitle}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Product Information */}
              <div className="mt-12 bg-gray-50 rounded-lg pl-8">
                <ul className="space-y-1.5 text-xs text-black">
                  <li className="list-disc">
                    {" "}
                    All gemstones are sourced and selected by a member of the
                    family.
                  </li>
                  <li className="list-disc">
                    {" "}
                    Diamonds used are typically F-H color, VVS - VS quality
                    unless otherwise specified.
                  </li>
                  <li className="list-disc">
                    {" "}
                    Color Stones' origin and quality as stated
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="mt-16 flex flex-col lg:flex-row gap-6 lg:items-center">
            <div className="text-center w-full lg:w-1/4 mb-8 px-4 sm:px-6 lg:px-0">
              <h2 className="text-2xl font-bold text-black mb-4">
                More For You
              </h2>
              <p className="text-black text-sm max-w-2xl mx-auto leading-relaxed">
                Drawing inspiration from the dance of precious stones, here are
                more pieces we think you'd enjoy
              </p>
            </div>

            <div className="relative block sm:hidden px-2 sm:px-4 md:px-6">
              {/* Swiper */}
              <Swiper
                modules={[Navigation]}
                spaceBetween={8}
                slidesPerView={2}
                loop={true}
                navigation={{
                  prevEl: prevRefMore.current,
                  nextEl: nextRefMore.current,
                }}
                onInit={(swiper) => {
                  // @ts-ignore
                  swiper.params.navigation.prevEl = prevRefMore.current;
                  // @ts-ignore
                  swiper.params.navigation.nextEl = nextRefMore.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }}
                className="pb-6"
              >
                {more_section.map((item, i) => (
                  <SwiperSlide key={i}>
                    <div className="w-full overflow-hidden">
                      <div className="w-full aspect-square border border-gray-300">
                        <img src={item.src} alt={"explore img"} />
                      </div>
                      <div className="text-center py-3 text-xs font-medium text-gray-600 leading-relaxed">
                        {item.name}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation buttons */}
              <button
                ref={prevRefMore}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-fit w-fit flex items-center justify-center text-black"
              >
                <ChevronLeft size={36} />
              </button>
              <button
                ref={nextRefMore}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-fit w-fit flex items-center justify-center text-black"
              >
                <ChevronRight size={36} />
              </button>
            </div>

            <div className="hidden sm:grid grid-cols-3 flex-1 gap-2 px-2 sm:px-4 lg:px-0">
              {more_section.map((item, i) => (
                <div key={i} className="w-full overflow-hidden">
                  <div className="w-full aspect-square border border-gray-300">
                    <img src={item.src} alt={"explore img"} />
                  </div>
                  <div className="text-center py-3 text-xs font-medium text-gray-600 leading-relaxed">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 flex flex-col lg:flex-row gap-6 lg:items-center">
            <div className="text-center w-full lg:w-1/4 mb-8 px-4 sm:px-6 lg:px-0">
              <h2 className="text-2xl font-bold text-black mb-4">
                Explore Kothari's
              </h2>
              <p className="text-black text-sm max-w-2xl mx-auto leading-relaxed">
                Discover our exquisite collection of fine jewellery, crafted
                with the utmost care and precision. From timeless classics to
                contemporary designs, each piece reflects the artistry and
                heritage of Kothari Fine Jewels.
              </p>
            </div>

            <div className="relative block sm:hidden px-2 sm:px-4 md:px-6">
              {/* Swiper */}
              <Swiper
                modules={[Navigation]}
                spaceBetween={8}
                slidesPerView={2}
                loop={true}
                navigation={{
                  prevEl: prevRefExplore.current,
                  nextEl: nextRefExplore.current,
                }}
                onInit={(swiper) => {
                  // @ts-ignore
                  swiper.params.navigation.prevEl = prevRefExplore.current;
                  // @ts-ignore
                  swiper.params.navigation.nextEl = nextRefExplore.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }}
                className="pb-6"
              >
                {explore.map((item, i) => (
                  <SwiperSlide key={i}>
                    <div className="w-full overflow-hidden">
                      <div className="w-full aspect-square ">
                        <img src={item.src} alt={"explore img"} />
                      </div>
                      <div className="text-center py-3 text-xs font-medium text-gray-600 leading-relaxed">
                        {item.name}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                ref={prevRefExplore}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-fit w-fit flex items-center justify-center text-white"
              >
                <ChevronLeft size={36} />
              </button>
              <button
                ref={nextRefExplore}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-fit w-fit flex items-center justify-center text-white"
              >
                <ChevronRight size={36} />
              </button>
            </div>

            <div className="hidden sm:grid grid-cols-3 flex-1 gap-2 px-2 sm:px-4 lg:px-0">
              {explore.map((item, i) => (
                <div key={i} className="w-full overflow-hidden">
                  <div className="w-full aspect-square ">
                    <img src={item.src} alt={"explore img"} />
                  </div>
                  <div className="text-center py-3 text-xs font-medium text-gray-600 leading-relaxed">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-none max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg md:text-xl font-normal text-gray-900">
                    Arrange a Viewing
                  </h3>
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close modal"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 md:p-8">
                <div className="space-y-6">
                  {/* Row 1: Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-normal text-gray-900 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-normal text-gray-900 mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Row 2: Phone and Product */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-normal text-gray-900 mb-2">
                        Your Telephone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-normal text-gray-900 mb-2">
                        Product
                      </label>
                      <input
                        type="text"
                        value={product.title}
                        readOnly
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-none bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Row 3: Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-normal text-gray-900 mb-2">
                        Viewing Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-normal text-gray-900 mb-2">
                        Viewing Time
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 4: Appointment Type */}
                  <div>
                    <label className="block text-sm font-normal text-gray-900 mb-2">
                      Appointment Type
                    </label>
                    <select
                      value={formData.appointmentType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          appointmentType: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors bg-white"
                    >
                      <option value="in-person">In person</option>
                      <option value="virtual">Virtual</option>
                    </select>
                  </div>

                  {/* Row 5: Message */}
                  <div>
                    <label className="block text-sm font-normal text-gray-900 mb-2">
                      Your Message
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors resize-none"
                      placeholder="Write your message here..."
                    />
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="p-6 md:p-8 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="w-full sm:w-auto px-6 py-2.5 text-sm font-normal text-gray-900 border border-gray-900 rounded-none hover:bg-gray-50 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-6 py-2.5 text-sm font-normal bg-gray-900 text-white border border-gray-900 rounded-none hover:bg-gray-800 transition-colors"
                >
                  SUBMIT ENQUIRY
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
