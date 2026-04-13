import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { BsCheckCircle } from "react-icons/bs";

const Business = () => {
  const router = useRouter();
  const features = [
    "Elite talent matching",
    "Dedicated concierge management",
    "Advanced project collaboration tools",
    "Secure enterprise payment solutions",
  ];

  return (
    <section id="business" className="bg-[#0f172a] px-6 md:px-[10%] py-20 md:py-32 flex flex-col lg:flex-row gap-16 md:gap-24 relative overflow-hidden">
      {/* Background Architectural Detail */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/5 blur-[120px] rounded-full -mr-20 -mt-20"></div>

      <div className="text-white flex flex-col gap-8 justify-center items-start lg:w-1/2 relative z-10">
        <div className="studio-reveal">
          <div className="flex gap-2 text-white text-2xl md:text-3xl font-black items-center mb-6">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white text-xl font-black backdrop-blur-md">
              A
            </div>
            <span className="tracking-tighter">
              ATELIER<span className="text-[#6366f1]">X</span> BUSINESS
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl mb-6 md:mb-8 font-black leading-[1.1] tracking-tighter">
            Built for <br /> 
            <span className="text-indigo-400">Enterprise Scale.</span>
          </h2>
        </div>

        <ul className="flex flex-col gap-6 md:gap-8 studio-reveal studio-delay-1">
          {features.map((feature) => (
            <li key={feature} className="flex gap-4 items-center group">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-500/30">
                <BsCheckCircle className="text-indigo-400 text-sm group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-slate-300 font-bold tracking-tight text-lg">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="studio-reveal studio-delay-2 mt-8">
          <button
            onClick={() => router.push("/search?q=business")}
            className="group relative inline-flex items-center justify-center bg-white text-[#0f172a] px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] studio-ambient hover:scale-105 active:scale-95 transition-all"
            type="button"
          >
            Explore the AtelierX Standard
          </button>
        </div>
      </div>

      <div className="relative w-full aspect-video lg:aspect-square lg:w-1/2 studio-reveal studio-delay-2">
        <div className="relative w-full h-full rounded-[3rem] overflow-hidden studio-ambient studio-ghost-border p-4 bg-white/5 backdrop-blur-md animate-parallax">
           <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
            <Image
              src="/business.png"
              alt="business"
              fill
              className="object-cover transform hover:scale-105 transition-transform duration-[3000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 to-transparent"></div>
           </div>
        </div>
        
        {/* Floating Stat Card */}
        <div className="absolute -bottom-6 -left-6 studio-paper p-8 studio-ambient studio-ghost-border max-w-[200px] animate-float">
          <p className="text-3xl font-black text-[#0f172a] mb-1">99%</p>
          <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 mb-4 block">
            AtelierX Ecosystem
          </span>
        </div>
      </div>
    </section>
  );
};

export default Business;
