import React from "react";
import ContactTerminal from "../components/Contact/ContactTerminal";
import Head from "next/head";

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] studio-grain">
      <Head>
        <title>Concierge | AtelierX Support</title>
      </Head>

      {/* Hero Section */}
      <section className="px-6 md:px-[10%] pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[11px] uppercase tracking-[0.5em] font-black text-indigo-500 mb-6 block studio-reveal">
            Global Assistance Tier
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] tracking-tighter leading-[1.1] mb-8 studio-reveal studio-delay-1">
            AtelierX <span className="text-indigo-500">Concierge.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto studio-reveal studio-delay-2">
            Whether you are scaling a technical architectural vision or navigating a payment milestone, our dedicated team is here to ensure seamless execution.
          </p>
        </div>
      </section>

      {/* Terminal Section */}
      <section className="px-6 md:px-[10%] pb-32">
        <ContactTerminal />
      </section>

      {/* Trust Signifiers */}
      <section className="px-6 md:px-[10%] py-24 bg-[#0f172a] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 blur-[120px] rounded-full"></div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10 text-center md:text-left">
           <div>
              <h4 className="text-white text-xl font-black mb-4 tracking-tight">Rapid Response</h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Our Priority Tier ensures all Concierge inquiries are addressed within an average of 4 hours globally.
              </p>
           </div>
           <div>
              <h4 className="text-white text-xl font-black mb-4 tracking-tight">Escrow Security</h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Direct access to our billing department for any concerns regarding identity verification or payment release.
              </p>
           </div>
           <div>
              <h4 className="text-white text-xl font-black mb-4 tracking-tight">Technical Architects</h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Communicate directly with our platform architects for API integrations or enterprise structural support.
              </p>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
