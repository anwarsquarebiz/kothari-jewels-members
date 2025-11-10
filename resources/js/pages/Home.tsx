import { LandingNav } from "@/components/aftab-components/LandingNav";
import { useGSAP } from "@gsap/react";
import { Head } from "@inertiajs/react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MusicPlayer } from "./MusicPlayer";

interface Props {
  title: string;
  description: string;
}

const slides = [
  // {
  //   id: 1,
  //   url: "/media/landing-page/expanded_1.jpg",
  //   // title: "Emerald Garden Necklace",
  //   // material: "18K Yellow Gold & Emeralds",
  //   // description:
  //     // "A stunning statement necklace featuring vibrant emeralds set in lustrous yellow gold, inspired by nature's timeless beauty.",
  //   // price: "$18,500",
  // },
  {
    id: 2,
    url: "/media/landing-page/expanded_2.jpg",
    // title: "Floral Diamond Bracelet",
    title: "A Jewellery Legacy Spanning Four Generations",
    // material: "Platinum & White Diamonds",
    // description:
    //   "Exquisite floral motifs adorned with brilliant diamonds, delicately crafted to grace your wrist with unparalleled elegance.",
    // price: "$24,750",
  },
  {
    id: 3,
    url: "/media/landing-page/expanded_3.jpg",
    // title: "Emerald and Diamond Choker",
    title: "A Jewellery Legacy Spanning Four Generations",
    position: "object-[40%_50%]",
    // material: "White Gold & Premium Crystals",
    // description:
    //   "Emerald and Diamond Choker, paired with an impressive pair of Emerald and Baguette Cut Eartops",
    // price: "$6,900",
  },
  {
    id: 4,
    url: "/media/landing-page/expanded_4.jpg",
    // title: "Fancy Yellow & White Diamond Constellation Necklace",
    title: "A Jewellery Legacy Spanning Four Generations",
    position: "object-[60%_40%] scale-110",
    // material: "White Gold & Premium Crystals",
    // description:
    //   "Fancy Yellow and White Diamond Constellation Necklace, paired with the House' interpretation of Chandbali Earrings",
    // price: "$6,900",
  },
  // {
  //   id: 5,
  //   url: "/media/landing-page/expanded_5.jpg",
  //   // title: "Round Brilliant Diamond Hoops",
  //   // material: "White Gold & Premium Crystals",
  //   // description:
  //   //   "Sophisticated geometric hoops featuring premium crystals that capture and reflect light with mesmerizing brilliance.",
  //   // price: "$6,900",
  // },
];

export default function Home({ title, description }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  // Remove these lines as they're now handled by MusicContext
  // const [isPlaying, setIsPlaying] = useState(false);
  // const audioRef = useRef<HTMLAudioElement>(null);
  // const gifRef = useRef<HTMLImageElement>(null);

  const slideRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Remove this function as it's now handled by MusicContext
  // const toggleMusic = () => {
  //   if (!audioRef.current) return;

  //   if (isPlaying) {
  //     audioRef.current.pause();
  //     setIsPlaying(false);
  //     if (gifRef.current) {
  //       gifRef.current.style.animation = "none";
  //     }
  //   } else {
  //     audioRef.current.play();
  //     setIsPlaying(true);
  //     if (gifRef.current) {
  //       gifRef.current.style.animation = "spin 2s linear infinite";
  //     }
  //   }
  // };

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
      className="relative h-screen w-full overflow-hidden"
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

      {/* Remove this audio element as it's now handled by MusicContext */}
      {/* <audio
        ref={audioRef}
        src="/media/music/music.mp3"
        onEnded={() => setIsPlaying(false)}
      /> */}

      <div ref={slideRef} className="absolute inset-0">
        <img
          src={slides[currentIndex].url}
          alt={slides[currentIndex].title}
          className={`h-full w-full object-cover ${
            slides[currentIndex].position || ""
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/50" />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className={`absolute top-1/2 left-5 z-10 -translate-y-1/2 rounded-full p-3 text-white transition-all duration-300 md:left-7 lg:left-8 ${
          isAnimating ? "cursor-not-allowed opacity-50" : "hover:bg-white/20"
        }`}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
      </button>

      {/* Keep title in the middle of the screen and font should be Playfair Display */}
      <div
        ref={titleRef}
        className="absolute top-1/2 left-1/2 z-10 w-[60%] -translate-x-1/2 -translate-y-1/2 text-center"
      >
        <h1 className="text-center font-['Playfair_Display'] text-xl text-white md:text-3xl lg:text-4xl">
          {slides[currentIndex].title}
        </h1>
      </div>

      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className={`absolute top-1/2 right-5 z-10 -translate-y-1/2 rounded-full p-3 text-white transition-all duration-300 md:right-7 lg:right-8 ${
          isAnimating ? "cursor-not-allowed opacity-50" : "hover:bg-white/20"
        }`}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 z-50 flex -translate-x-1/2 gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "h-2 w-10 bg-white"
                : "h-2 w-2 bg-white/40 hover:bg-white/60"
            } ${isAnimating ? "cursor-not-allowed" : ""}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Jewelry Information */}
      <div
        ref={infoRef}
        className="absolute right-0 bottom-0 left-0 z-10 p-5 text-white md:p-7 lg:p-12"
      >
        <div className="mb-[100px] max-w-2xl md:mb-auto lg:mb-auto">
          {/* <div
            ref={materialRef}
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
          >
            <p className="text-xs md:text-sm tracking-wider uppercase opacity-90">
              {slides[currentIndex].material}
            </p>
          </div> */}

          {/* <h1 ref={titleRef} className="mb-3">
                        {slides[currentIndex].title}
                    </h1> */}

          <p ref={descRef} className="mb-5 max-w-xl leading-relaxed opacity-90">
            {slides[currentIndex].description}
          </p>
        </div>
      </div>

      {/* Music Toggle - This now uses the global MusicPlayer component */}
      <MusicPlayer />
    </div>
  );
}
