import { Head, Link } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LandingNav } from "@/components/aftab-components/LandingNav";

interface Props {
  title: string;
  description: string;
}

const slides = [
  {
    id: 1,
    url: "/media/landing-page/expanded_1.jpg",
    title: "Emerald Garden Necklace",
    material: "18K Yellow Gold & Emeralds",
    description:
      "A stunning statement necklace featuring vibrant emeralds set in lustrous yellow gold, inspired by nature's timeless beauty.",
    price: "$18,500",
  },
  {
    id: 2,
    url: "/media/landing-page/expanded_2.jpg",
    title: "Floral Diamond Bracelet",
    material: "Platinum & White Diamonds",
    description:
      "Exquisite floral motifs adorned with brilliant diamonds, delicately crafted to grace your wrist with unparalleled elegance.",
    price: "$24,750",
  },
  {
    id: 3,
    url: "/media/landing-page/expanded_3.jpg",
    title: "Crystal Hoop Earrings",
    material: "White Gold & Premium Crystals",
    description:
      "Sophisticated geometric hoops featuring premium crystals that capture and reflect light with mesmerizing brilliance.",
    price: "$6,900",
  },
];

export default function Home({ title, description }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const slideRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const gifRef = useRef<HTMLImageElement>(null);

  const nextSlide = () => {
    if (isAnimating) return;
    setPreviousIndex(currentIndex);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setIsAnimating(true);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setPreviousIndex(currentIndex);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAnimating(true);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setPreviousIndex(currentIndex);
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsAnimating(true);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (gifRef.current) {
        gifRef.current.style.animation = "none";
      }
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      if (gifRef.current) {
        gifRef.current.style.animation = "spin 2s linear infinite";
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isAnimating]);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    // Create temporary div for previous slide
    const prevSlideElement = document.createElement("div");
    prevSlideElement.className = "absolute inset-0";
    prevSlideElement.innerHTML = `
      <img src="${slides[previousIndex].url}" alt="${slides[previousIndex].title}" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/50" />
    `;
    containerRef.current.appendChild(prevSlideElement);

    // Animate previous slide out
    tl.to(
      prevSlideElement,
      {
        x: direction > 0 ? "-100%" : "100%",
        opacity: 0,
        duration: 0.8,
        ease: "power3.inOut",
      },
      0
    );

    // Animate current slide in
    tl.fromTo(
      slideRef.current,
      {
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.inOut",
      },
      0
    );

    // Animate info panel with stagger
    tl.fromTo(
      materialRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
      0.3
    )
      .fromTo(
        titleRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        descRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      );


    // Clean up the temporary element after animation
    tl.call(() => {
      if (
        containerRef.current &&
        containerRef.current.contains(prevSlideElement)
      ) {
        containerRef.current.removeChild(prevSlideElement);
      }
    });
  }, [currentIndex, direction, previousIndex]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden h-screen relative"
    >
      <Head title="Home" />
      <LandingNav currentPage={"/"} isLightPage={false} />

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <audio
        ref={audioRef}
        src="/media/music/music.mp3"
        onEnded={() => setIsPlaying(false)}
      />

      <div ref={slideRef} className="absolute inset-0">
        <img
          src={slides[currentIndex].url}
          alt={slides[currentIndex].title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/50" />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className={`absolute left-5 md:left-7 lg:left-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all duration-300 ${
          isAnimating ? "opacity-50 cursor-not-allowed" : "hover:bg-white/20"
        }`}
        aria-label="Previous slide"
      >
        <ChevronLeft className=" w-5 h-5 lg:w-6 lg:h-6" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className={`absolute right-5 md:right-7 lg:right-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all duration-300 ${
          isAnimating ? "opacity-50 cursor-not-allowed" : "hover:bg-white/20"
        }`}
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-10 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/60"
            } ${isAnimating ? "cursor-not-allowed" : ""}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Jewelry Information */}
      <div
        ref={infoRef}
        className="absolute bottom-0 left-0 right-0 z-10 p-5 md:p-7 lg:p-12 text-white"
      >
        <div className="max-w-2xl">
          <div
            ref={materialRef}
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
          >
            <p className="text-xs md:text-sm tracking-wider uppercase opacity-90">
              {slides[currentIndex].material}
            </p>
          </div>

          <h1 ref={titleRef} className="mb-3">
            {slides[currentIndex].title}
          </h1>

          <p ref={descRef} className="mb-5 opacity-90 leading-relaxed max-w-xl">
            {slides[currentIndex].description}
          </p>
        </div>
      </div>

      {/* Music Toggle */}
      <button
        ref={gifRef}
        onClick={toggleMusic}
        className="w-13 bg-white/20 border border-white/30 p-1 rounded-full aspect-square flex items-center justify-center cursor-pointer fixed bottom-4 right-4 z-[50] hover:scale-110 transition-transform duration-200"
        aria-label="Toggle music"
      >
        <div className="absolute h-3 w-3 rounded-full bg-black"></div>
        <img
          src="/media/landing-page/music.gif"
          className="w-full h-full object-cover rounded-full"
          alt="Music toggle"
        />
      </button>
    </div>
  );
}
