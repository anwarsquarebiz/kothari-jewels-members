import { LandingNav } from '@/components/aftab-components/LandingNav';
import { useGSAP } from '@gsap/react';
import { Head, useForm } from '@inertiajs/react';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';
import { useRef, useState } from 'react';

interface Props {
    title: string;
    description: string;
    success?: string;
}

export default function Contact({ title, description, success }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        mobile: '',
        product: '',
        visitWeek: '',
        preferredTimes: '',
        source: '',
    });


    const blob1Ref = useRef<HTMLDivElement>(null);
    const blob2Ref = useRef<HTMLDivElement>(null);
    const leftContentRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const subtitleRef = useRef<HTMLHeadingElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const diamondRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => {
                reset();
            },
        });
    };


    useGSAP(() => {
        const tl = gsap.timeline();

        // Animate background blobs
        tl.fromTo(
            blob1Ref.current,
            { opacity: 0, scale: 0.8 },
            { opacity: 0.05, scale: 1, duration: 1.5, ease: 'power2.out' },
        ).fromTo(
            blob2Ref.current,
            { opacity: 0, scale: 0.8 },
            { opacity: 0.05, scale: 1, duration: 1.5, ease: 'power2.out' },
            '-=1.2',
        );

        // Animate left content
        tl.fromTo(
            leftContentRef.current,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
            '-=1',
        );

        // Animate decorative line
        tl.fromTo(
            lineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 1, ease: 'power2.inOut' },
            '-=0.5',
        );

        // Animate left content text
        tl.fromTo(
            subtitleRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.7',
        )
            .fromTo(
                titleRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
                '-=0.5',
            )
            .fromTo(
                descRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
                '-=0.5',
            );

        // Animate decorative diamond
        tl.fromTo(
            diamondRef.current,
            { opacity: 0, rotation: 0 },
            { opacity: 0.1, rotation: 45, duration: 1, ease: 'power2.out' },
            '-=0.4',
        );

        // Animate form fields with stagger
        if (formRef.current) {
            const formFields = formRef.current.querySelectorAll('.form-field');
            tl.fromTo(
                formFields,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out',
                },
                '-=1',
            );
        }

        // Animate button
        tl.fromTo(
            buttonRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
            '-=0.3',
        );
    }, []);

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden pt-32 sm:pt-36 md:pt-40 pb-32 sm:pb-36 md:pb-40 lg:pb-0">
            <Head title="Contact Us" />
            <LandingNav setCurrentPage={() => {}} currentPage={'/contact'} isLightPage={true} />

            <div className="inset-0 flex items-center justify-center overflow-hidden from-neutral-50 via-white to-neutral-100 p-8">
                {/* Background Decorative Elements */}
                <div
                    ref={blob1Ref}
                    className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-neutral-900 opacity-0 blur-3xl"
                />
                <div
                    ref={blob2Ref}
                    className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-neutral-900 opacity-0 blur-3xl"
                />

                <div className="relative grid w-full max-w-6xl grid-cols-1 items-start gap-16 lg:grid-cols-12">
                    {/* Left Content - Offset Design */}
                    <div
                        ref={leftContentRef}
                        className="relative opacity-0 lg:col-span-5"
                    >
                        <div className="relative">
                            {/* Decorative Line */}
                            <div
                                ref={lineRef}
                                className="absolute top-0 -left-8 h-full w-px origin-left bg-gradient-to-b from-transparent via-neutral-300 to-transparent"
                                style={{ scaleX: 0 }}
                            />

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <h2
                                        ref={subtitleRef}
                                        className="text-xs tracking-[0.3em] text-neutral-500 uppercase"
                                    >
                                        Contact Us
                                    </h2>

                                    <h1
                                        ref={titleRef}
                                        className="text-3xl leading-tight text-neutral-900"
                                    >
                                        Get In Touch
                                    </h1>
                                </div>

                                <p
                                    ref={descRef}
                                    className="max-w-md text-sm leading-relaxed text-neutral-600"
                                >
                                    We'd love to hear from you. Share your
                                    details and we'll get back to you shortly to
                                    discuss your bespoke jewelry requirements.
                                </p>

                                {/* Additional Info */}
                                <div className="space-y-3 border-t border-neutral-200 pt-6">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-2.5 h-1 w-1 bg-neutral-900" />
                                        <div>
                                            <p className="mb-1 text-xs tracking-wider text-neutral-500 uppercase">
                                                {' '}
                                                Showroom Hours{' '}
                                            </p>
                                            <p className="text-sm text-neutral-700">
                                                {' '}
                                                Monday - Saturday: 10am -
                                                5:30pm{' '}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-2.5 h-1 w-1 bg-neutral-900" />
                                        <div>
                                            <p className="mb-1 text-xs tracking-wider text-neutral-500 uppercase">
                                                {' '}
                                                Contact Number{' '}
                                            </p>
                                            <p className="text-sm text-neutral-700">
                                                {' '}
                                                +91 98205 15907{' '}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative Diamond Shape */}
                                <div
                                    ref={diamondRef}
                                    className="absolute -right-12 -bottom-20 h-40 w-40 border border-neutral-300 opacity-0"
                                    style={{ rotation: 0 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Form */}
                    <div className="lg:col-span-7">
                        {success && (
                            <div className="mb-6 rounded-md bg-green-50 p-4 text-green-800">
                                {success}
                            </div>
                        )}
                        
                        <form
                            ref={formRef}
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="form-field space-y-3 opacity-0">
                                    <label
                                        htmlFor="name"
                                        className="block text-xs tracking-widest text-neutral-500 uppercase"
                                    >
                                        Name
                                    </label>
                                    <div className="group relative">
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={`w-full border-b-2 bg-transparent px-0 py-3 text-xs text-neutral-900 transition-all placeholder:text-neutral-400 focus:outline-none ${
                                                errors.name ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 focus:border-neutral-900'
                                            }`}
                                            placeholder="Your name"
                                        />
                                        <div className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-focus-within:w-full ${
                                            errors.name ? 'bg-red-500' : 'bg-neutral-900'
                                        }`} />
                                        {errors.name && (
                                            <div className="mt-1 text-xs text-red-500">{errors.name}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-field space-y-3 opacity-0">
                                    <label
                                        htmlFor="email"
                                        className="block text-xs tracking-widest text-neutral-500 uppercase"
                                    >
                                        Email Address
                                    </label>
                                    <div className="group relative">
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={`w-full border-b-2 bg-transparent px-0 py-3 text-xs text-neutral-900 transition-all placeholder:text-neutral-400 focus:outline-none ${
                                                errors.email ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 focus:border-neutral-900'
                                            }`}
                                            placeholder="your@email.com"
                                        />
                                        <div className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-focus-within:w-full ${
                                            errors.email ? 'bg-red-500' : 'bg-neutral-900'
                                        }`} />
                                        {errors.email && (
                                            <div className="mt-1 text-xs text-red-500">{errors.email}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-field space-y-3 opacity-0">
                                <label
                                    htmlFor="mobile"
                                    className="block text-xs tracking-widest text-neutral-500 uppercase"
                                >
                                    Mobile Number
                                </label>
                                <div className="group relative">
                                    <input
                                        id="mobile"
                                        type="tel"
                                        value={data.mobile}
                                        onChange={(e) => setData('mobile', e.target.value)}
                                        className={`w-full border-b-2 bg-transparent px-0 py-3 text-xs text-neutral-900 transition-all placeholder:text-neutral-400 focus:outline-none ${
                                            errors.mobile ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 focus:border-neutral-900'
                                        }`}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                    <div className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-focus-within:w-full ${
                                        errors.mobile ? 'bg-red-500' : 'bg-neutral-900'
                                    }`} />
                                    {errors.mobile && (
                                        <div className="mt-1 text-xs text-red-500">{errors.mobile}</div>
                                    )}
                                </div>
                            </div>

                            <div className="form-field space-y-3 opacity-0">
                                <label
                                    htmlFor="product"
                                    className="block text-xs tracking-widest text-neutral-500 uppercase"
                                >
                                    Product Interested in{' '}
                                    <span className="text-neutral-400">
                                        {' '}
                                        (Optional){' '}
                                    </span>
                                </label>
                                <div className="group relative">
                                    <input
                                        id="product"
                                        type="text"
                                        value={data.product}
                                        onChange={(e) => setData('product', e.target.value)}
                                        className="w-full border-b-2 border-neutral-300 bg-transparent px-0 py-3 text-xs text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                                        placeholder="Emerald Necklace, Diamond Bracelet..."
                                    />
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-neutral-900 transition-all duration-300 group-focus-within:w-full" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="form-field space-y-3 opacity-0">
                                    <label
                                        htmlFor="visitWeek"
                                        className="block text-xs tracking-widest text-neutral-500 uppercase"
                                    >
                                        Desired Day of Visit
                                    </label>
                                    <div className="group relative">
                                        <select
                                            id="visitWeek"
                                            value={data.visitWeek}
                                            onChange={(e) => setData('visitWeek', e.target.value)}
                                            className="w-full border-b-2 border-neutral-300 bg-transparent px-0 py-3 text-xs text-neutral-900 transition-all focus:border-neutral-900 focus:outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>
                                                Select a day
                                            </option>
                                            <option value="monday">Monday</option>
                                            <option value="tuesday">Tuesday</option>
                                            <option value="wednesday">Wednesday</option>
                                            <option value="thursday">Thursday</option>
                                            <option value="friday">Friday</option>
                                        </select>
                                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-neutral-900 transition-all duration-300 group-focus-within:w-full" />
                                        <ChevronDown className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="form-field space-y-3 opacity-0">
                                    <label
                                        htmlFor="preferredTimes"
                                        className="block text-xs tracking-widest text-neutral-500 uppercase"
                                    >
                                        Preferred Time of Visit
                                    </label>
                                    <div className="group relative">
                                        <select
                                            id="preferredTimes"
                                            value={data.preferredTimes}
                                            onChange={(e) => setData('preferredTimes', e.target.value)}
                                            className="w-full border-b-2 border-neutral-300 bg-transparent px-0 py-3 text-xs text-neutral-900 transition-all focus:border-neutral-900 focus:outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>
                                                Select a time
                                            </option>
                                            <option value="10am-12pm">10 AM TO 12 PM</option>
                                            <option value="12pm-1:30pm">12 PM TO 1:30 PM</option>
                                            <option value="2:30pm-4pm">2:30 PM TO 4 PM</option>
                                            <option value="4pm-5:30pm">4 PM TO 5:30 PM</option>
                                        </select>
                                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-neutral-900 transition-all duration-300 group-focus-within:w-full" />
                                        <ChevronDown className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-field relative z-20 space-y-3 opacity-0">
                                <label
                                    htmlFor="source"
                                    className="block text-xs tracking-widest text-neutral-500 uppercase"
                                >
                                    How did you hear about us ?
                                </label>
                                <div className="group relative">
                                    <select
                                        id="source"
                                        value={data.source}
                                        onChange={(e) => setData('source', e.target.value)}
                                        className="w-full border-b-2 border-neutral-300 bg-transparent px-0 py-3 text-xs text-neutral-900 transition-all focus:border-neutral-900 focus:outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>
                                            Select an option
                                        </option>
                                        <option value="website">Website</option>
                                        <option value="referral">Client Referral</option>
                                    </select>
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-neutral-900 transition-all duration-300 group-focus-within:w-full" />
                                    <ChevronDown className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                                </div>
                            </div>

                            <button
                                ref={buttonRef}
                                type="submit"
                                disabled={processing}
                                className="group relative mt-10 w-full overflow-hidden border border-neutral-900 bg-transparent px-8 py-4 text-xs tracking-[0.2em] text-neutral-900 uppercase opacity-0 transition-all duration-300 hover:bg-neutral-900 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="relative z-10">
                                    {processing ? 'Submitting...' : 'Submit Inquiry'}
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
