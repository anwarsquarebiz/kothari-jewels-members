import { Head } from "@inertiajs/react";
import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";
import { LandingNav } from "@/components/aftab-components/LandingNav";

interface Props {
  title: string;
  description: string;
}

export default function Contact({ title, description }: Props) {
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
    console.log("Form submitted:", formData);
  };

  const handleSelectOption = (value: string) => {
    setFormData({ ...formData, source: value });
    setIsSelectOpen(false);
  };

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      blob1Ref.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 0.05, scale: 1, duration: 1.5 }
    )
      .fromTo(
        blob2Ref.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 0.05, scale: 1, duration: 1.5 },
        "-=1.2"
      )
      .fromTo(
        leftContentRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8 },
        "-=1"
      )
      .fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1 },
        "-=0.5"
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.7"
      )
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.5"
      )
      .fromTo(
        descRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.5"
      )
      .fromTo(
        diamondRef.current,
        { opacity: 0, rotation: 0 },
        { opacity: 0.1, rotation: 45, duration: 1 },
        "-=0.4"
      );

    if (formRef.current) {
      const formFields = formRef.current.querySelectorAll(".form-field");
      tl.fromTo(
        formFields,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        "-=1"
      );
    }

    tl.fromTo(
      buttonRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      "-=0.3"
    );
  }, []);

  return (
    <div className="w-full relative min-h-screen bg-neutral-50 pt-32 sm:pt-36 md:pt-40 pb-32 sm:pb-36 md:pb-40 lg:pb-0 overflow-x-hidden">
      <Head title="Contact Us" />
      <LandingNav currentPage={"/contact"} isLightPage={true} />

      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-8 lg:grid lg:grid-cols-12 lg:gap-12 items-start">
        {/* Left Content */}
        <div
          ref={leftContentRef}
          className="lg:col-span-5 relative mb-8 lg:mb-0"
        >
          <div className="relative">
            <div
              ref={lineRef}
              className="absolute -left-8 top-0 w-px h-full bg-gradient-to-b from-transparent via-neutral-300 to-transparent origin-left"
              style={{ scaleX: 0 }}
            />
            <div className="space-y-4">
              <h2
                ref={subtitleRef}
                className="text-neutral-500 tracking-[0.3em] uppercase text-sm"
              >
                Contact Us
              </h2>
              <h1
                ref={titleRef}
                className="text-neutral-900 leading-tight text-5xl"
              >
                Get In Touch
              </h1>
              <p
                ref={descRef}
                className="text-neutral-600 leading-relaxed max-w-md text-sm"
              >
                We'd love to hear from you. Share your details and we'll get
                back to you shortly to discuss your bespoke jewelry
                requirements.
              </p>

              <div
                ref={diamondRef}
                className="absolute -bottom-20 -right-12 w-40 h-40 border border-neutral-300 opacity-0"
                style={{ rotation: 0 }}
              />
            </div>
          </div>
        </div>

        {/* Right Content - Form */}
        <div className="lg:col-span-7 relative z-20">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-field space-y-1 opacity-0">
                <label
                  htmlFor="name"
                  className="block text-xs text-neutral-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-2 py-1.5 bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all"
                  placeholder="Your name"
                />
              </div>
              <div className="form-field space-y-1 opacity-0">
                <label
                  htmlFor="email"
                  className="block text-xs text-neutral-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-2 py-1.5 bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="form-field space-y-1 opacity-0">
              <label
                htmlFor="mobile"
                className="block text-xs text-neutral-700"
              >
                Mobile
              </label>
              <input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
                className="w-full px-2 py-1.5 bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all"
                placeholder="+91 00000 00000"
              />
            </div>

<<<<<<< HEAD

=======
            <div className="form-field space-y-1 opacity-0">
              <label
                htmlFor="product"
                className="block text-xs text-neutral-700"
              >
                Product Interested In
              </label>
              <input
                id="product"
                type="text"
                value={formData.product}
                onChange={(e) =>
                  setFormData({ ...formData, product: e.target.value })
                }
                className="w-full px-2 py-1.5 bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all"
                placeholder="Optional"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-field space-y-1 opacity-0">
                <label
                  htmlFor="visitWeek"
                  className="block text-xs text-neutral-700"
                >
                  Week of Visit
                </label>
                <input
                  id="visitWeek"
                  type="text"
                  value={formData.visitWeek}
                  onChange={(e) =>
                    setFormData({ ...formData, visitWeek: e.target.value })
                  }
                  className="w-full px-2 py-1.5 bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all"
                  placeholder="Next week"
                />
              </div>
              <div className="form-field space-y-1 opacity-0">
                <label
                  htmlFor="preferredTimes"
                  className="block text-xs text-neutral-700"
                >
                  Preferred Time
                </label>
                <input
                  id="preferredTimes"
                  type="text"
                  value={formData.preferredTimes}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredTimes: e.target.value })
                  }
                  className="w-full px-2 py-1.5 bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all"
                  placeholder="Morning / Afternoon"
                />
              </div>
            </div>

            {/* Select */}
            <div className="form-field relative z-20 space-y-1 opacity-0">
              <label
                htmlFor="source"
                className="block text-xs text-neutral-700"
              >
                How did you hear about us?
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                  className="w-full px-2 py-1.5 bg-white border border-neutral-300 text-sm text-neutral-900 text-left flex items-center justify-between focus:outline-none focus:border-neutral-600 transition-all"
                >
                  <span
                    className={
                      formData.source ? "text-neutral-900" : "text-neutral-400"
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
                  <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 shadow-md">
                    <button
                      type="button"
                      onClick={() => handleSelectOption("website")}
                      className="w-full px-3 py-1.5 text-left text-sm text-neutral-800 hover:bg-neutral-100"
                    >
                      Website
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectOption("referral")}
                      className="w-full px-3 py-1.5 text-left text-sm text-neutral-800 hover:bg-neutral-100"
                    >
                      Client Referral
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              ref={buttonRef}
              type="submit"
              className="w-full mt-6 px-6 py-2 bg-transparent border border-neutral-800 text-neutral-800 hover:bg-neutral-800 hover:text-white transition-all duration-300 ease text-sm tracking-wide relative overflow-hidden group"
            >
              Submit Inquiry
            </button>
          </form>
        </div>

        {/* Background Blobs */}
        <div
          ref={blob1Ref}
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-neutral-900 blur-3xl opacity-5 lg:opacity-0"
        />
        <div
          ref={blob2Ref}
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-neutral-900 blur-3xl opacity-5 lg:opacity-0"
        />
      </div>
    </div>
  );
}
>>>>>>> 0db59c5efa48180fdc6bb9ec55f16ecee55f1f5e
