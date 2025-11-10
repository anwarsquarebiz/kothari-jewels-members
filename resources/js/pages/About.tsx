import { LandingNav } from '@/components/aftab-components/LandingNav';
import { useGSAP } from '@gsap/react';
import { Head } from '@inertiajs/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

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

    // Use state to track screen size for conditional logic and rendering
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    // 1. Check screen size on initial load and on resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 1024); // Tailwind's 'lg' breakpoint
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        // Cleanup the event listener on component unmount
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // 2. Custom scroll logic: ONLY apply on large screens
    useEffect(() => {
        // If it's not a large screen, do nothing.
        if (!isLargeScreen) {
            return;
        }

        const content = contentRef.current;
        if (!content) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault(); // Prevent the whole page from scrolling
            content.scrollTop += e.deltaY;
        };

        const handleTouch = (() => {
            let startY = 0;
            return {
                start: (e: TouchEvent) => (startY = e.touches[0].clientY),
                move: (e: TouchEvent) => {
                    e.preventDefault(); // Prevent the whole page from scrolling
                    const delta = startY - e.touches[0].clientY;
                    content.scrollTop += delta;
                    startY = e.touches[0].clientY;
                },
            };
        })();

        // Add global event listeners to hijack scrolling
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouch.start, {
            passive: true,
        });
        window.addEventListener('touchmove', handleTouch.move, {
            passive: false,
        });

        // IMPORTANT: Cleanup function to remove listeners when the screen becomes small
        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouch.start);
            window.removeEventListener('touchmove', handleTouch.move);
        };
    }, [isLargeScreen]); // This effect re-runs whenever `isLargeScreen` changes

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.fromTo(
            imageRef.current,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        );

        tl.fromTo(
            lineRef.current,
            { scaleY: 0 },
            { scaleY: 1, duration: 1, ease: 'power2.inOut' },
            '-=0.3',
        );

        tl.fromTo(
            contentRef.current,
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.6',
        );

        tl.fromTo(
            subtitleRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.4',
        ).fromTo(
            titleRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.4',
        );

        if (paragraphsRef.current) {
            const paragraphs = paragraphsRef.current.querySelectorAll('p');
            tl.fromTo(
                paragraphs,
                { opacity: 0, y: 15 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out',
                },
                '-=0.3',
            );
        }

        tl.fromTo(
            decorativeRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 1, ease: 'power2.inOut' },
            '-=0.5',
        );
    }, []);

    return (
        // 3. Main container: allow normal scroll on mobile, hide on desktop
        <div
            className={`w-full bg-neutral-50 ${
                isLargeScreen ? 'overflow-hidden' : 'overflow-y-auto'
            }`}
        >
            <Head title="About Us" />
            <LandingNav currentPage={'/about'} isLightPage={true} />

            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image Section */}
                {/* Hide on mobile */}
                <div
                    ref={imageRef}
                    className="relative hidden h-[50vh] opacity-0 md:block lg:sticky lg:top-0 lg:block lg:h-screen"
                >
                    <img
                        src="/media/landing-page/AWO03580.JPG"
                        alt="Kothari Jewelry Heritage"
                        className="h-full w-full object-cover"
                    />

                    <h2
                        ref={titleRef}
                        className="primary-font absolute inset-0 z-10 flex items-center justify-center text-2xl font-medium tracking-tight text-neutral-900 text-white md:text-6xl font-['Playfair_Display']"
                    >
                        The Kothari Story
                    </h2>
                </div>

                {/* Content Section */}
                <div
                    ref={contentRef}
                    className="relative flex flex-col justify-start overflow-y-auto px-4 py-32 opacity-0 sm:px-6 md:px-16 lg:px-24"
                    style={{ maxHeight: '100vh' }} // Ensure content scrollable independently
                >
                    <div className="mx-auto max-w-xl lg:mx-0">
                        <div>
                            <div className="relative h-full w-full">
                                <img
                                    src="/media/landing-page/AWO03580.JPG"
                                    alt="Jewelry"
                                    className="mb-10 block aspect-square h-full w-full rounded-lg object-cover lg:hidden"
                                />

                                <h2
                                    ref={titleRef}
                                    className="primary-font absolute inset-0 z-10 flex items-center justify-center text-4xl font-medium tracking-tight text-neutral-900 text-white md:text-8xl font-['Playfair_Display'] lg:hidden"
                                >
                                    The Kothari Story
                                </h2>
                            </div>

                            <div
                                ref={paragraphsRef}
                                className="space-y-6 leading-relaxed text-neutral-700"
                            >
                                <p>
                                    The Kothari story began in Bombay in the
                                    1940s, when members of the family earned
                                    trust as diamantaires in what was then known
                                    as the "Divine trade". Then, the
                                    professional world of Jewellery was a
                                    discreet circle dealing in treasures once
                                    reserved for kings, queens, and worldly
                                    connoisseurs. Their reputation rested on
                                    judgement, integrity, and relationships
                                    rather than promotion - values that remain
                                    at the heart of the house today.
                                </p>

                                <p>
                                    Over generations, the family evolved from
                                    traders to jewellers, seeking out
                                    exceptional precious stones: Golconda
                                    Diamonds, Burmese Rubies, Colombian and
                                    Zambian Emeralds, Basra Pearls, and upon
                                    instinct, any rare gem or object of beauty
                                    that lies beyond familiar frontiers. Once
                                    home, each gem is examined by a member of
                                    the family before being set, and each
                                    careful design mulled over extended periods
                                    to remain true to an imagination that will
                                    honor the eye-watering stones.
                                </p>

                                <p>
                                    Today Kothari Fine Jewels, headed by
                                    Avinash, Amrish, and fourth generation
                                    Karan, has become a renowned private Jewelry
                                    house. From its atelier on Altamount Road,
                                    Kothari Fine Jewels continue to serve
                                    clientele in India and abroad, offering not
                                    just bejeweled adornment but a form of
                                    cultural continuity - where rarity, design,
                                    and trust converge quietly and enduringly.
                                </p>
                            </div>

                            <div
                                ref={decorativeRef}
                                className="mt-12 h-px w-32 origin-left bg-gradient-to-r from-neutral-400 to-transparent"
                                style={{ scaleX: 0 }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
