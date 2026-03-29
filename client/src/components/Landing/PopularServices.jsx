import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const NextArrow = ({ className, style, onClick }) => (
  <button
    type="button"
    className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white rounded-full studio-ambient border border-slate-200 text-[#0f172a] hover:scale-110 hover:border-indigo-500 hover:text-indigo-500 transition-all shadow-xl"
    onClick={onClick}
    aria-label="Next slide"
  >
    <FiChevronRight size={20} />
  </button>
);

const PrevArrow = ({ className, style, onClick }) => (
  <button
    type="button"
    className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white rounded-full studio-ambient border border-slate-200 text-[#0f172a] hover:scale-110 hover:border-indigo-500 hover:text-indigo-500 transition-all shadow-xl"
    onClick={onClick}
    aria-label="Previous slide"
  >
    <FiChevronLeft size={20} />
  </button>
);

const PopularServices = () => {
  const router = useRouter();

  const popularServices = [
    { name: "Ai Artists", label: "Creative AI", image: "/service1.png" },
    { name: "Logo Design", label: "Brand Identity", image: "/service2.jpeg" },
    { name: "Wordpress", label: "Web Architecture", image: "/service3.jpeg" },
    { name: "Voice Over", label: "Auditory Design", image: "/service4.jpeg" },
    { name: "Social Media", label: "Strategic Growth", image: "/service5.jpeg" },
    { name: "SEO", label: "Search Logic", image: "/service6.jpeg" },
    { name: "Illustration", label: "Visual Arts", image: "/service7.jpeg" },
    { name: "Translation", label: "Global Linguistics", image: "/service8.jpeg" },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    cssEase: "cubic-bezier(0.23, 1, 0.32, 1)",
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <section className="studio-band py-24 md:py-36 px-6 md:px-[10%] relative overflow-visible">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="max-w-2xl">
          <span className="text-[11px] uppercase tracking-[0.4em] font-black text-slate-400 mb-4 block studio-reveal">
            Curated Zones
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tight studio-reveal studio-delay-1">
            Popular Freelance <span className="text-[#6366f1]">Specialties.</span>
          </h2>
        </div>
        <p className="text-slate-500 text-sm md:text-base max-w-sm studio-reveal studio-delay-2 leading-relaxed">
          Discover hand-picked experts across creative, technical, and architectural disciplines.
        </p>
      </div>

      <div className="relative studio-reveal studio-delay-3">
        <Slider {...settings}>
          {popularServices.map(({ name, label, image }, index) => (
            <div key={name} className="px-3 pb-8">
              <div
                className="group studio-paper relative h-[420px] overflow-hidden cursor-pointer studio-ambient transition-all duration-500 hover:-translate-y-2 studio-ghost-border p-2"
                onClick={() => router.push(`/search?q=${name.toLowerCase()}`)}
              >
                {/* Background Image with Gradient Overlay */}
                <div className="absolute inset-2 overflow-hidden rounded-[2rem]">
                  <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
                    <Image
                      src={image}
                      alt={name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-indigo-300 mb-2 block">
                    {label}
                  </span>
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight">
                    {name}
                  </h3>
                  <div className="w-12 h-1 bg-indigo-400 rounded-full translate-x-[-100%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 delay-100" />
                </div>
                
                {/* Subtle Studio Corner Hint */}
                <div className="absolute top-8 right-8 w-10 h-10 border-t border-r border-white/20 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default PopularServices;
