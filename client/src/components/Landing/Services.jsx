import React from "react";
import { categories } from "../../utils/categories";
import Image from "next/image";
import router from "next/router";

const Services = () => {
  return (
    <section className="studio-section px-6 md:px-[10%] py-24 md:py-36 bg-white">
      <div className="max-w-3xl mb-16">
        <span className="text-[11px] uppercase tracking-[0.4em] font-black text-slate-400 mb-4 block studio-reveal">
          Service Spectrum
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tight leading-tight studio-reveal studio-delay-1">
          Hand-Picked <span className="text-[#6366f1]">Specialists</span> <br /> 
          For Every Discipline.
        </h2>
      </div>

      <ul className="grid grid-cols-2 lg:grid-cols-5 gap-0 studio-reveal studio-delay-2 rounded-[3.5rem] overflow-hidden studio-ambient studio-ghost-border border-slate-100">
        {categories.map(({ name, logo }, index) => (
          <li
            key={name}
            className={`group flex flex-col justify-center items-center cursor-pointer p-12 md:p-14 transition-all duration-700 hover:bg-white hover:z-10 ${
              index % 2 === 0 ? "bg-white" : "bg-slate-50"
            }`}
            onClick={() =>
              router.push(`/search?category=${name.toLowerCase()}`)
            }
          >
            <div className="relative mb-8 transform group-hover:scale-110 group-hover:-translate-y-3 transition-transform duration-700 ease-out">
              <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100">
                <Image src={logo} alt={name} height={80} width={80} className="object-contain" />
              </div>
            </div>
            <span className="text-[#0f172a] font-black text-sm text-center tracking-tight group-hover:text-[#6366f1] transition-colors">
              {name}
            </span>
            <div className="mt-5 w-8 h-1 bg-[#6366f1] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
          </li>
        ))}
      </ul>
      
      {/* Editorial Quote Detail */}
      <div className="mt-20 flex justify-center studio-reveal studio-delay-3">
        <div className="max-w-md text-center">
          <p className="text-slate-400 italic text-sm font-medium leading-relaxed">
            &ldquo;We don&apos;t just provide services; we provide the architectural foundation for your digital legacy.&rdquo;
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="w-8 h-px bg-slate-200"></span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-300">Atelier Philosophy</span>
            <span className="w-8 h-px bg-slate-200"></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
