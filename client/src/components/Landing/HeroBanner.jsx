import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

const HeroBanner = () => {
  const router = useRouter();
  const [searchData, setSearchData] = useState("");

  const handleSearch = () => {
    if (searchData.trim()) router.push(`/search?q=${searchData}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="studio-section pt-32 md:pt-48 pb-20 px-6 md:px-[10%] overflow-hidden min-h-[85vh] flex items-center">
      {/* Background Architectural Hint */}
      <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 L100 0" stroke="var(--primary)" strokeWidth="0.1" fill="none" />
          <path d="M0 0 L100 100" stroke="var(--primary)" strokeWidth="0.1" fill="none" />
        </svg>
      </div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        {/* Left Content: Editorial Detail */}
        <div className="lg:col-span-7 flex flex-col gap-8 md:gap-12">
          <div className="studio-reveal">
            <span className="text-[11px] uppercase tracking-[0.4em] font-black text-slate-400 mb-4 block">
              Architecting Digital Excellence
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] font-black text-[#0f172a] tracking-tighter">
              The Future of <br />
              <span className="text-[#6366f1]">Fluid Work.</span>
            </h1>
          </div>

          <p className="studio-reveal studio-delay-1 text-slate-500 text-lg md:text-xl max-w-xl leading-relaxed">
            A curated studio marketplace where architectural precision meets professional talent. 
            Find the perfect partner for your next digital masterpiece.
          </p>

          <div className="studio-reveal studio-delay-2 max-w-2xl">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-transparent rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex flex-col md:flex-row items-center studio-glass studio-ambient rounded-full studio-ghost-border p-2">
                <div className="relative flex-1 w-full">
                  <IoSearchOutline className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                  <input
                    type="text"
                    placeholder="Search for any service..."
                    className="w-full py-4 md:py-5 pl-14 pr-6 bg-transparent text-[#0f172a] focus:outline-none placeholder:text-slate-400 font-medium"
                    onChange={(e) => setSearchData(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="w-full md:w-auto bg-[#6366f1] hover:bg-[#4f46e5] text-white py-4 px-10 rounded-full text-xs font-black uppercase tracking-widest studio-ambient transition-all"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="studio-reveal studio-delay-3 flex items-center gap-6">
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-300">Popular:</span>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {["Design", "AI", "Code", "Strategy"].map((tag) => (
                <button 
                  key={tag}
                  onClick={() => router.push(`/search?q=${tag.toLowerCase()}`)}
                  className="text-[11px] font-bold uppercase tracking-widest px-5 py-2 rounded-full border border-slate-200 text-slate-400 hover:border-[#6366f1] hover:text-[#6366f1] transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content: Premium Visual */}
        <div className="lg:col-span-5 relative studio-reveal studio-delay-2 hidden lg:block">
          <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden studio-ambient animate-parallax studio-ghost-border p-4 bg-white">
            <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
              <Image
                src="/hero_studio_architectural_1774766439002.png"
                alt="Architectural Studio"
                fill
                className="object-cover transform hover:scale-110 transition-transform duration-[2000ms] ease-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/20 to-transparent"></div>
            </div>
          </div>
          
          {/* Floating Detail Card */}
          <div className="absolute -bottom-8 -left-8 studio-paper p-10 studio-ambient studio-ghost-border max-w-[260px] animate-float">
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-indigo-500 mb-3">
              Curated Selection
            </p>
            <p className="text-xl font-black text-[#0f172a] mb-3 leading-[1.2] tracking-tight">
              Top 1% Global <br />
              Digital Talent
            </p>
            <div className="w-10 h-1 bg-indigo-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
