import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useStateProvider } from "../../context/StateContext";
import { reducerCases } from "../../context/constants";

const JoinFreelance = () => {
  const router = useRouter();
  const [{ userInfo }, dispatch] = useStateProvider();

  const handleJoin = () => {
    if (userInfo) {
       router.push("/seller");
    } else {
      dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: true });
    }
  };

  return (
    <section className="studio-section py-24 md:py-40 px-6 md:px-[10%] relative overflow-hidden">
      {/* High-Impact Deep Studio 'Jewel' Background */}
      <div className="absolute inset-x-6 md:inset-x-20 inset-y-10 rounded-[3rem] md:rounded-[5rem] bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#6366f1] overflow-hidden studio-ambient animate-parallax">
        {/* Animated Architectural Elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 0 L100 100" stroke="white" strokeWidth="0.05" fill="none" />
            <path d="M100 0 L0 100" stroke="white" strokeWidth="0.05" fill="none" />
          </svg>
        </div>
        
        {/* Dynamic Gradient Orbs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#0f172a]/40 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto relative z-10 px-8 md:px-20 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full">
          
          {/* Left: Persuasive Narrative */}
          <div className="lg:col-span-7 flex flex-col gap-8 md:gap-10 py-10">
            <div className="studio-reveal">
              <span className="text-[11px] uppercase tracking-[0.4em] font-black text-indigo-300/60 mb-6 block">
                The Next Evolution
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-tight">
                Ready to join <br/> <span className="text-indigo-400">AtelierX?</span>
              </h2>
            </div>

            <p className="text-slate-300 text-lg md:text-xl max-w-xl leading-relaxed studio-reveal studio-delay-1">
              Join the premiere collective of digital artisans. Whether you create digital solutions or hire for them, your next masterpiece begins here on AtelierX.
            </p>

            <div className="flex flex-wrap gap-6 studio-reveal studio-delay-2">
              <button 
                onClick={handleJoin}
                className="bg-white text-[#0f172a] px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] studio-ambient hover:scale-105 active:scale-95 transition-all"
              >
                Join AtelierX
              </button>
              <button 
                onClick={() => router.push("/search?q=popular")}
                className="bg-transparent border border-white/20 text-white px-10 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] backdrop-blur-md hover:bg-white/10 transition-all"
              >
                Explore More
              </button>
            </div>
            
            <div className="mt-4 studio-reveal studio-delay-3 flex items-center gap-4">
               <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1e293b] bg-slate-200 overflow-hidden ring-2 ring-indigo-500/20">
                     <Image src={`/service${i}.jpeg`} alt="User" width={40} height={40} className="object-cover" />
                   </div>
                 ))}
               </div>
               <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black">
                 Trusted by 50,000+ Freelancers
               </p>
            </div>
          </div>

          {/* Right: Abstract Depth Visual */}
          <div className="lg:col-span-5 relative hidden lg:block studio-reveal studio-delay-2">
            <div className="relative aspect-square w-full rounded-[4rem] overflow-hidden studio-ambient studio-ghost-border p-4 bg-white/5 animate-parallax">
               <div className="relative w-full h-full rounded-[3.5rem] overflow-hidden">
                 <Image 
                   src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" 
                   fill 
                   alt="Creative Professional"
                   className="object-cover transform hover:scale-110 transition-transform duration-[4000ms]"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 to-transparent"></div>
               </div>
            </div>
            
            {/* Studio Element */}
            <div className="absolute -top-10 -right-10 w-24 h-24 studio-glass rounded-[2rem] studio-ambient flex items-center justify-center animate-float group">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:rotate-12 transition-transform">
                A
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinFreelance;
