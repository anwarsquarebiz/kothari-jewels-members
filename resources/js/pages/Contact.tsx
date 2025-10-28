import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";
import { LandingNav } from "@/components/aftab-components/LandingNav";
import { Head } from "@inertiajs/react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    product: "",
    visitWeek: "",
    preferredTimes: "",
    source: "",
  });

  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const topContentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const diamondRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleSelectOption = (value: string) => {
    setFormData({ ...formData, source: value });
    setIsSelectOpen(false);
  };

  useGSAP(() => {
    const tl = gsap.timeline();

    // Animate background blobs
    tl.fromTo(
      blob1Ref.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 0.05, scale: 1, duration: 1.5, ease: "power2.out" }
    ).fromTo(
      blob2Ref.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 0.05, scale: 1, duration: 1.5, ease: "power2.out" },
      "-=1.2"
    );

    // Animate top content
    tl.fromTo(
      topContentRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
      "-=1"
    );

    // Animate decorative line
    tl.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1, ease: "power2.inOut" },
      "-=0.5"
    );

    // Animate top content text
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.7"
    )
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.5"
      )
      .fromTo(
        descRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.5"
      );

    // Animate decorative diamond
    tl.fromTo(
      diamondRef.current,
      { opacity: 0, rotation: 0 },
      { opacity: 0.1, rotation: 45, duration: 1, ease: "power2.out" },
      "-=0.4"
    );

    // Animate image
    if (imageRef.current) {
      tl.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
        "-=1"
      );
    }

    // Animate form fields with stagger
    if (formRef.current) {
      const formFields = formRef.current.querySelectorAll(".form-field");
      tl.fromTo(
        formFields,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=1"
      );
    }

    // Animate button
    tl.fromTo(
      buttonRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.3"
    );
  }, []);

  return (
    <div className="w-full relative min-h-screen bg-neutral-50 overflow-x-hidden">
      <Head title="Contact Us" />
      <LandingNav currentPage={"/contact"} isLightPage={true} />

      <div className="relative w-full pt-32 sm:pt-36 md:pt-40 pb-20 sm:pb-24 md:pb-32">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 overflow-hidden pointer-events-none">
          <div
            ref={blob1Ref}
            className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-neutral-900 blur-3xl opacity-0"
          />
          <div
            ref={blob2Ref}
            className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-neutral-900 blur-3xl opacity-0"
          />
        </div>

        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Grid - Image (Hidden on Mobile/Tablet) and Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Left Image - Hidden on Mobile and Tablet */}
            <div
              ref={imageRef}
              className="hidden lg:flex lg:col-span-5 items-center justify-center opacity-0"
            >
              <div className="w-full aspect-square bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-lg flex items-center justify-center overflow-hidden shadow-lg">
                <img
                  src="/media/landing-page/contact.JPG"
                  alt="Jewelry"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Content - Form */}
            <div className="lg:col-span-7">
              {/* Top Content - Info Section */}
              <div ref={topContentRef} className="relative opacity-0 mb-8">
                <div className="relative">
                  {/* Decorative Line */}
                  <div
                    ref={lineRef}
                    className="absolute -left-8 top-0 w-px h-full bg-gradient-to-b from-transparent via-neutral-300 to-transparent origin-left"
                    style={{ scaleX: 0 }}
                  />

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h2
                        ref={subtitleRef}
                        className="text-neutral-500 tracking-[0.3em] uppercase text-xs"
                      >
                        Contact Us
                      </h2>

                      <h1
                        ref={titleRef}
                        className="text-neutral-900 leading-tight text-3xl md:text-4xl"
                      >
                        Get In Touch
                      </h1>
                    </div>

                    <p
                      ref={descRef}
                      className="text-neutral-600 leading-relaxed text-sm max-w-md"
                    >
                      We'd love to hear from you. Share your details and we'll
                      get back to you shortly to discuss your bespoke jewelry
                      requirements.
                    </p>

                    {/* Additional Info */}
                    <div className="pt-6 space-y-3 border-t border-neutral-200">
                      <div className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-neutral-900 mt-2.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                            Showroom Hours
                          </p>
                          <p className="text-neutral-700 text-sm">
                            Monday - Friday: 10:00am - 5:30pm
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-neutral-900 mt-2.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                            Contact Numbers
                          </p>
                          <p className="text-neutral-700 text-sm">
                            +91 9820140053
                          </p>
                          <p className="text-neutral-700 text-sm">
                            +91 9820515907
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Diamond Shape */}
                    <div
                      ref={diamondRef}
                      className="absolute -bottom-20 -right-12 w-40 h-40 border border-neutral-300 opacity-0 hidden lg:block"
                      style={{ rotation: 0 }}
                    />
                  </div>
                </div>
              </div>

              {/* Form */}
              <div ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="form-field space-y-3 opacity-0">
                    <label
                      htmlFor="name"
                      className="block text-xs text-neutral-500 uppercase tracking-widest"
                    >
                      Name
                    </label>
                    <div className="relative group">
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-0 py-3 bg-transparent border-b-2 text-xs border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-all"
                        placeholder="Your name"
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-neutral-900 transition-all duration-300 group-focus-within:w-full" />
                    </div>
                  </div>

                  <div className="form-field space-y-3 opacity-0">
                    <label
                      htmlFor="email"
                      className="block text-xs text-neutral-500 uppercase tracking-widest"
                    >
                      Email Address
                    </label>
                    <div className="relative group">
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-0 py-3 bg-transparent border-b-2 text-xs border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-all"
                        placeholder="your@email.com"
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-neutral-900 transition-all duration-300 group-focus-within:w-full" />
                    </div>
                  </div>
                </div>

                <div className="form-field space-y-3 opacity-0">
                  <label
                    htmlFor="mobile"
                    className="block text-xs text-neutral-500 uppercase tracking-widest"
                  >
                    Mobile Number
                  </label>
                  <div className="relative group">
                    <input
                      id="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({ ...formData, mobile: e.target.value })
                      }
                      className="w-full px-0 py-3 bg-transparent border-b-2 text-xs border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-all"
                      placeholder="+91 (9820) 000-0000"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-neutral-900 transition-all duration-300 group-focus-within:w-full" />
                  </div>
                </div>

                <div className="form-field space-y-3 opacity-0">
                  <label
                    htmlFor="product"
                    className="block text-xs text-neutral-500 uppercase tracking-widest"
                  >
                    Product Interested in{" "}
                    <span className="text-neutral-400">(Optional)</span>
                  </label>
                  <div className="relative group">
                    <input
                      id="product"
                      type="text"
                      value={formData.product}
                      onChange={(e) =>
                        setFormData({ ...formData, product: e.target.value })
                      }
                      className="w-full px-0 py-3 bg-transparent border-b-2 text-xs border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-all"
                      placeholder="Emerald Necklace, Diamond Bracelet..."
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-neutral-900 transition-all duration-300 group-focus-within:w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="form-field space-y-3 opacity-0">
                    <label
                      htmlFor="visitWeek"
                      className="block text-xs text-neutral-500 uppercase tracking-widest"
                    >
                      Desired Week of Visit
                    </label>
                    <div className="relative group">
                      <input
                        id="visitWeek"
                        type="text"
                        value={formData.visitWeek}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            visitWeek: e.target.value,
                          })
                        }
                        className="w-full px-0 py-3 bg-transparent border-b-2 text-xs border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-all"
                        placeholder="e.g., Next week"
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-neutral-900 transition-all duration-300 group-focus-within:w-full" />
                    </div>
                  </div>

                  <div className="form-field space-y-3 opacity-0">
                    <label
                      htmlFor="preferredTimes"
                      className="block text-xs text-neutral-500 uppercase tracking-widest"
                    >
                      Preferred Times
                    </label>
                    <div className="relative group">
                      <input
                        id="preferredTimes"
                        type="text"
                        value={formData.preferredTimes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredTimes: e.target.value,
                          })
                        }
                        className="w-full px-0 py-3 bg-transparent border-b-2 text-xs border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-all"
                        placeholder="Morning / Afternoon"
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-neutral-900 transition-all duration-300 group-focus-within:w-full" />
                    </div>
                  </div>
                </div>

                <div className="form-field relative z-20 space-y-3 opacity-0">
                  <label
                    htmlFor="source"
                    className="block text-xs text-neutral-500 uppercase tracking-widest"
                  >
                    How did you hear about us?
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsSelectOpen(!isSelectOpen)}
                      className="w-full px-0 py-3 bg-transparent border-b-2 text-xs border-neutral-300 text-neutral-900 text-left focus:outline-none focus:border-neutral-900 transition-all flex items-center justify-between group"
                    >
                      <span
                        className={
                          formData.source
                            ? "text-neutral-900"
                            : "text-neutral-400"
                        }
                      >
                        {formData.source === "website" && "Website"}
                        {formData.source === "referral" && "Client Referral"}
                        {!formData.source && "Select an option"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-500 transition-transform ${
                          isSelectOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isSelectOpen && (
                      <div className="absolute z-[9999] w-full mt-2 bg-white border border-neutral-200 shadow-2xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleSelectOption("website")}
                          className="w-full px-4 py-3 text-xs text-left text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-200"
                        >
                          Website
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectOption("referral")}
                          className="w-full px-4 py-3 text-xs text-left text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-200 border-t border-neutral-100"
                        >
                          Client Referral
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  ref={buttonRef}
                  type="button"
                  onClick={handleSubmit}
                  className="w-full mt-10 px-8 py-3 bg-transparent text-neutral-900 border border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 tracking-[0.2em] uppercase text-xs relative overflow-hidden group opacity-0"
                >
                  <span className="relative z-10">Submit Inquiry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
