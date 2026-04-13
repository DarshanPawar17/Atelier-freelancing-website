import Image from "next/image";
import React from "react";
import { BsCheckCircle } from "react-icons/bs";

const Everything = () => {
  const checkData = [
    {
      title: "Professional Precision",
      subtitle: "Every project is treated as a masterpiece, handled with the utmost technical and creative rigor.",
    },
    {
      title: "Curated Talent Pool",
      subtitle: "Access a hand-picked collective of the top 1% global digital artisans and freelancers.",
    },
    {
      title: "Encrypted Operations",
      subtitle: "State-of-the-art security protocols ensuring your data and deliverables remain pristine.",
    },
    {
      title: "24/7 Concierge Support",
      subtitle: "Around-the-clock dedicated assistance for seamless project execution and delivery.",
    },
  ];

  return (
    <section className="studio-section py-24 md:py-48 px-6 md:px-[10%] bg-slate-50/50 overflow-hidden">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left Content: Narrative Section */}
        <div className="flex flex-col gap-10 md:gap-14">
          <div className="studio-reveal">
            <span className="text-[11px] uppercase tracking-[0.4em] font-black text-slate-400 mb-4 block">
              The AtelierX Standard
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-[#0f172a] leading-[1.1] tracking-tighter">
              A Whole World of <br />
              <span className="text-[#6366f1]">Elite Talent</span> <br />
              at Your Fingertips.
            </h2>
          </div>

          <ul className="flex flex-col gap-8 md:gap-10">
            {checkData.map(({ title, subtitle }, index) => (
              <li 
                key={title} 
                className={`flex gap-6 studio-reveal`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="mt-1 shrink-0">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center">
                    <BsCheckCircle className="text-[#6366f1] text-lg" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-xl font-black text-[#0f172a] tracking-tight">
                    {title}
                  </h4>
                  <p className="text-slate-500 text-sm md:text-base max-w-md leading-relaxed">
                    {subtitle}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Content: Geometric Visual */}
        <div className="relative studio-reveal">
          <div className="relative aspect-square w-full rounded-[4rem] overflow-hidden studio-ambient animate-parallax studio-ghost-border p-6 bg-white">
            <div className="relative w-full h-full rounded-[3rem] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
                fill
                alt="Studio Excellence"
                className="object-cover transform hover:scale-105 transition-transform duration-[3000ms]"
              />
              {/* Slate Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a]/40 via-transparent to-transparent"></div>
            </div>
          </div>
          
          {/* Decorative Elemental Accents */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-slate-500/5 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>
          
          {/* Floating 'Quality' Tag */}
          <div className="absolute top-12 -left-6 studio-paper py-3 px-6 studio-ambient studio-ghost-border animate-float">
             <span className="text-[10px] uppercase tracking-widest font-black text-[#6366f1]">
                Verified Freelancers Only
             </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Everything;
