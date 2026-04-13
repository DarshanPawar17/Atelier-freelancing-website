import React from "react";
import Head from "next/head";
import { FiClock, FiActivity, FiGlobe, FiDatabase, FiLock, FiCpu } from "react-icons/fi";
import { StatusBadge, ServiceCard } from "../components/Support/StatusIndicator";

const SystemStatus = () => {
  const services = [
    { name: "Checkout Terminal", desc: "Razorpay Gateway & Escrow", status: "operational" },
    { name: "Architectural Search", desc: "Global Gig Discovery Engine", status: "operational" },
    { name: "Media Assets", desc: "Cloudinary Image Delivery", status: "operational" },
    { name: "Auth Protocol", desc: "JWT & Identity Verification", status: "operational" },
    { name: "Real-time Hub", desc: "Socket.io Messaging Backbone", status: "operational" },
    { name: "Core Database", desc: "MongoDB Production Cluster", status: "operational" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] studio-grain">
      <Head>
        <title>System Status | AtelierX Infrastructure</title>
      </Head>

      {/* Hero Section */}
      <section className="px-6 md:px-[10%] pt-24 pb-16 md:pt-40 md:pb-24 text-center">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-full studio-ambient studio-ghost-border mb-8 studio-reveal">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#0f172a]">
              All Core Systems are Operational
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] tracking-tighter leading-tight mb-8 studio-reveal studio-delay-1 uppercase">
            Platform <br /> 
            <span className="text-indigo-500">Infrastructure.</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto studio-reveal studio-delay-2">
            Real-time health monitoring of the AtelierX global network. We maintain 99.9% uptime across all architectural tiers.
          </p>
        </div>
      </section>

      {/* Global Metrics Bar */}
      <section className="px-6 md:px-[10%] mb-16">
        <div className="max-w-6xl mx-auto studio-paper studio-ambient studio-ghost-border p-8 md:p-12 bg-white flex flex-wrap justify-between items-center gap-8 studio-reveal studio-delay-3">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 text-xl">
                 <FiActivity size={24} />
              </div>
              <div>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Global Load</p>
                 <p className="text-xl font-black text-[#0f172a]">Normal (12ms)</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 text-xl">
                 <FiGlobe size={24} />
              </div>
              <div>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Regional Access</p>
                 <p className="text-xl font-black text-[#0f172a]">Active (18 Nodes)</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 text-xl">
                 <FiClock size={24} />
              </div>
              <div>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Last Update</p>
                 <p className="text-xl font-black text-[#0f172a]">Just Now</p>
              </div>
           </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 md:px-[10%] pb-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <ServiceCard key={i} {...service} />
          ))}
        </div>
      </section>

      {/* Maintenance Log */}
      <section className="px-6 md:px-[10%] pb-32">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-[#0f172a] mb-12 flex items-center gap-4 uppercase tracking-tighter">
            <span className="w-12 h-px bg-slate-200"></span>
            Past Incidents & Maintenance
          </h2>
          <div className="space-y-6">
             <div className="studio-glass studio-ghost-border p-10 rounded-[2.5rem] bg-white text-center">
                <FiClock className="text-slate-200 text-5xl mx-auto mb-6" />
                <p className="text-slate-400 font-bold italic">No incidents reported in the last 90 days.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Callout */}
      <footer className="px-6 md:px-[10%] py-24 bg-white border-t border-slate-100">
         <div className="max-w-4xl mx-auto text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 block">AtelierX Node Architecture</span>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale items-center">
               <FiDatabase size={32} />
               <FiCpu size={32} />
               <FiGlobe size={32} />
               <FiLock size={32} />
            </div>
         </div>
      </footer>
    </div>
  );
};

export default SystemStatus;
