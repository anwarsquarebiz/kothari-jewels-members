import { Head } from "@inertiajs/react";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LandingNav } from "@/components/aftab-components/LandingNav";

interface Props {
  title: string;
  description: string;
}

export default function About({ title, description }: Props) {
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const decorativeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphsRef = useRef<HTMLDivElement>(null);

  // Scroll from anywhere
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleWheel = (e: WheelEvent) => {
      content.scrollTop += e.deltaY;
    };

    const handleTouch = (() => {
      let startY = 0;
      return {
        start: (e: TouchEvent) => (startY = e.touches[0].clientY),
        move: (e: TouchEvent) => {
          const delta = startY - e.touches[0].clientY;
          content.scrollTop += delta;
          startY = e.touches[0].clientY;
        },
      };
    })();

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouch.start, { passive: true });
    window.addEventListener("touchmove", handleTouch.move, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouch.start);
      window.removeEventListener("touchmove", handleTouch.move);
    };
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      imageRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
    );

    tl.fromTo(
      lineRef.current,
      { scaleY: 0 },
      { scaleY: 1, duration: 1, ease: "power2.inOut" },
      "-=0.3"
    );

    tl.fromTo(
      contentRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    );

    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    ).fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );

    if (paragraphsRef.current) {
      const paragraphs = paragraphsRef.current.querySelectorAll("p");
      tl.fromTo(
        paragraphs,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.3"
      );
    }

    tl.fromTo(
      decorativeRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1, ease: "power2.inOut" },
      "-=0.5"
    );
  }, []);

  return (
    <div className="w-full overflow-hidden bg-neutral-50">
      <Head title="About Us" />
      <LandingNav currentPage={"/about"} isLightPage={true} />

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image Section */}
        <div
          ref={imageRef}
          className="
            relative h-[50vh] lg:h-screen
            opacity-0
            lg:sticky lg:top-0
          "
        >
          <img
            src="/media/landing-page/about-ill.png"
            alt="Kothari Jewelry Heritage"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div
          ref={contentRef}
          className="relative flex flex-col justify-start px-8 md:px-16 lg:px-24 py-24 overflow-y-auto opacity-0"
          style={{ maxHeight: "100vh" }} // Ensure content scrollable independently
        >
          <div className="max-w-xl mx-auto lg:mx-0">
            <div>
              <div className="mb-10">
                <h2
                  ref={subtitleRef}
                  className="text-neutral-500 tracking-[0.3em] uppercase text-sm mb-6"
                >
                  Our Heritage
                </h2>
                <h1
                  ref={titleRef}
                  className="text-neutral-900 font-medium primary-font mb-8 text-7xl md:text-8xl tracking-tight"
                >
                  Kothari
                </h1>
              </div>

              <div
                ref={paragraphsRef}
                className="space-y-6 text-neutral-700 leading-relaxed"
              >
                <p>
                  Founded in the 1940s, Kothari has expanded its horizons
                  continually for four generations - and is currently
                  flourishing under brothers Avinash, Amrish, and the latest
                  addition to the legacy, Karan.
                </p>

                <p>
                  Kothari sources some of the finest rare gemstones from across
                  the world. Persistent attention to minute detail in executing
                  Original designs has enabled the firm to enjoy the patronage
                  of clients both in India and internationally, encompassing the
                  corporate elite, the discerning collector, and even the
                  leading auction houses globally.
                </p>

                <p>
                  While endeavouring to keep pace with the dynamic styles of the
                  twenty-first century, Kothari retains the essence of elegance
                  and opulence embedded in Indian culture. Drawing inspiration
                  from the archives of both Indian and European royalty, they
                  have a selected range of unique pieces. These vary from Mughal
                  to Art Deco styles, and from traditional Indian to
                  contemporary designs – all set in an array of precious
                  gemstones.
                </p>

                <p>
                  Though India's love affair with jewellery is an unbroken
                  tradition spanning almost five thousand years, in the last few
                  decades well-travelled families have begun to yearn for a
                  contemporary touch while wishing to retain their roots and
                  influences. Keeping this in mind, and synonymous with an
                  intimate understanding of jewellery and careful craftsmanship,
                  Kothari ensures that every piece is thoughtfully and
                  artistically designed.
                </p>

                <p>
                  The firm understands that the acquisition of jewellery is a
                  special and significant decision, not only for weddings. Every
                  Kothari creation is a truly timeless and personal piece of
                  art, that is ultimately also valued internationally as a sound
                  investment.
                </p>
              </div>

              <div
                ref={decorativeRef}
                className="mt-12 h-px w-32 bg-gradient-to-r from-neutral-400 to-transparent origin-left"
                style={{ scaleX: 0 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
