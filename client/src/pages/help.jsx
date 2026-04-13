import React from "react";
import Head from "next/head";
import { FiSearch, FiBook, FiLock, FiCreditCard, FiUser, FiArrowRight } from "react-icons/fi";
import HelpAccordion from "../components/Support/HelpAccordion";

const HelpCenter = () => {
  const categories = [
    { name: "Getting Started", icon: <FiBook />, count: 12, style: "bg-blue-500" },
    { name: "Payments & Fees", icon: <FiCreditCard />, count: 8, style: "bg-emerald-500" },
    { name: "Trust & Safety", icon: <FiLock />, count: 15, style: "bg-rose-500" },
    { name: "Account Help", icon: <FiUser />, count: 10, style: "bg-indigo-500" },
  ];

  const commonQuestions = [
    {
      question: "How do I secure my first professional gig?",
      answer: "Start by perfecting your profile. Ensure your 'Architectural Identity' clearly showcases your specialties. We recommend starting with a competitive 'Discovery Price' to build your initial reputation within the AtelierX ecosystem. Once you accumulate 3-5 positive reviews, you can scale your rates to reflect your elite status."
    },
    {
      question: "How does the AtelierX Escrow protection work?",
      answer: "Security is our highest protocol. When a Client hires you, the payment is immediately captured and held in our secure AtelierX Escrow vault. The funds are only released to your 'Yield' (Earnings) once the Client formally approves the final delivery. This ensures designers are paid for their work and clients receive what they commissioned."
    },
    {
      question: "Can I switch between Client and Freelancer modes?",
      answer: "Absolutely. AtelierX is built for the multi-disciplinary professional. You can toggle between 'Freelancer Mode' to offer your services and 'Client Mode' to hire the world's best talent from your account dashboard. Each mode has its own dedicated workspace and order tracking."
    },
    {
      question: "What are the platform commission fees?",
      answer: "To maintain the high-quality infrastructure and concierge support of AtelierX, we retain a 15% platform fee on all successfully completed gigs. This fee powers our secure payment gateway, dispute resolution services, and continuous platform evolution."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] studio-grain">
      <Head>
        <title>Help Center | AtelierX Resources</title>
      </Head>

      {/* Hero Search */}
      <section className="px-6 md:px-[10%] pt-24 pb-20 md:pt-40 md:pb-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-500/5 blur-[120px] rounded-full"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[11px] uppercase tracking-[0.5em] font-black text-indigo-500 mb-6 block studio-reveal">
            Resource Directory
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] tracking-tighter leading-tight mb-12 studio-reveal studio-delay-1">
            How can we help <br /> 
            your <span className="text-indigo-500">evolution?</span>
          </h1>
          
          <div className="relative max-w-2xl mx-auto studio-reveal studio-delay-2">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 text-xl" />
            <input 
              type="text" 
              placeholder="Search for answers (e.g. Escrow, Payouts, Hiring...)"
              className="w-full py-6 pl-16 pr-8 bg-slate-50 border-none rounded-[2rem] text-sm font-bold text-[#0f172a] placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 transition-all studio-ambient"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 md:px-[10%] -mt-10 mb-24 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div key={i} className="studio-paper studio-ambient studio-ghost-border p-8 hover:-translate-y-2 transition-transform cursor-pointer group">
              <div className={`w-12 h-12 ${cat.style} rounded-2xl flex items-center justify-center text-white text-xl mb-6 shadow-lg shadow-indigo-500/10`}>
                {cat.icon}
              </div>
              <h3 className="text-lg font-black text-[#0f172a] tracking-tight mb-2 group-hover:text-indigo-500 transition-colors uppercase">{cat.name}</h3>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">{cat.count} Articles</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="px-6 md:px-[10%] pb-32">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-[#0f172a] mb-12 flex items-center gap-4 uppercase tracking-tighter">
            <span className="w-12 h-px bg-slate-200"></span>
            Frequent Inquiries
          </h2>
          <HelpAccordion items={commonQuestions} />
        </div>
      </section>

      {/* Promotional Callout */}
      <section className="px-6 md:px-[10%] py-24 mb-20">
        <div className="max-w-6xl mx-auto studio-glass rounded-[3rem] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 bg-[#0f172a] studio-ambient relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/10 blur-[100px] rounded-full"></div>
           <div className="relative z-10 text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Still seeking clarity?</h3>
              <p className="text-slate-400 font-medium max-w-md">Our Concierge tier is available 24/7 for direct architectural guidance and support inquiries.</p>
           </div>
           <div className="relative z-10 shrink-0">
              <a href="/contact" className="studio-cta bg-white text-[#0f172a] px-10 py-5 rounded-full text-xs font-black uppercase tracking-[0.3em] inline-flex items-center gap-4 hover:scale-105 transition-all">
                Contact Concierge <FiArrowRight />
              </a>
           </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;
