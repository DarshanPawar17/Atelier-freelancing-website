import React, { useState, useEffect } from "react";
import { FiSend, FiMail, FiMessageSquare, FiShield, FiCpu, FiNavigation, FiLock } from "react-icons/fi";
import { toast } from "react-toastify";
import { useStateProvider } from "../../context/StateContext";
import { reducerCases } from "../../context/constants";

const ContactTerminal = () => {
  const [{ userInfo }, dispatch] = useStateProvider();
  const [formData, setFormData] = useState({
    name: userInfo?.fullName || "",
    email: userInfo?.email || "",
    subject: "Concierge Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        name: userInfo.fullName || "",
        email: userInfo.email || "",
      }));
    }
  }, [userInfo]);

  const categories = [
    { id: "Concierge Inquiry", icon: <FiNavigation />, label: "Concierge", desc: "Enterprise & Strategy" },
    { id: "Technical Support", icon: <FiCpu />, label: "Technical", desc: "Platform & Access" },
    { id: "Billing Support", icon: <FiShield />, label: "Billing", desc: "Payments & Escrow" },
    { id: "General Inquiry", icon: <FiMessageSquare />, label: "General", desc: "Feedback & Other" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userInfo) {
      toast.error("Security Protocol: Please sign in to authenticate your request.");
      dispatch({ type: reducerCases.TOGGLE_LOGIN_MODAL });
      return;
    }

    setIsSubmitting(true);

    // Simulate real delay for premium feel
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Message received at AtelierX HQ. A Concierge will reach out shortly.");
    }, 2000);
  };

  if (isSuccess) {
    const ticketId = Math.random().toString(36).substring(2, 10).toUpperCase();
    return (
      <div className="w-full max-w-2xl mx-auto studio-reveal studio-glass rounded-[3.5rem] p-12 md:p-16 text-center studio-ambient relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16 rounded-full" />
        
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
          <FiSend className="text-emerald-500 text-3xl" />
        </div>
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />
          Priority Routing Enabled
        </div>

        <h3 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-4 tracking-tighter">Your inquiry is in expert hands.</h3>
        
        <p className="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto mb-10">
          We have successfully received your architectural brief. A dedicated AtelierX Concierge has been assigned to your case and will provide a resolution within <span className="text-[#0f172a] font-bold underline decoration-indigo-200">4-6 hours</span>.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-left">
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Ticket Reference</p>
            <p className="text-xl font-black text-[#0f172a] font-mono">#{ticketId}</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Status</p>
            <p className="text-xs font-black text-indigo-500 uppercase tracking-widest">Enroute to HQ</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.location.href = "/search?q=popular"}
            className="studio-primary py-4 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] studio-cta"
          >
            Explore Gigs While You Wait
          </button>
          <button 
            onClick={() => setIsSuccess(false)}
            className="bg-white studio-ghost-border py-4 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#0f172a] transition-colors"
          >
            New Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 studio-reveal">
      {/* Sidebar Info */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFormData({ ...formData, subject: cat.id })}
            className={`flex items-start gap-4 p-6 rounded-3xl transition-all duration-500 text-left ${
              formData.subject === cat.id 
              ? "bg-[#0f172a] text-white studio-ambient translate-x-2" 
              : "bg-white text-slate-400 hover:bg-slate-50"
            }`}
          >
            <div className={`mt-1 ${formData.subject === cat.id ? "text-indigo-400" : "text-slate-300"}`}>
              {cat.icon}
            </div>
            <div>
              <p className={`font-black tracking-tight ${formData.subject === cat.id ? "text-white" : "text-[#0f172a]"}`}>
                {cat.label}
              </p>
              <p className="text-[10px] uppercase tracking-widest opacity-60 font-medium mt-1">
                {cat.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Main Form */}
      <div className="lg:col-span-8">
        <div className="studio-glass rounded-[3rem] p-8 md:p-12 studio-ambient studio-ghost-border bg-white/40 backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 ml-4">Full Identity</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alexander Knight"
                  className="bg-white/50 border-none rounded-2xl p-5 text-sm font-bold text-[#0f172a] placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500/20 transition-all studio-ambient"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 ml-4">Direct Email</label>
                <div className="relative">
                  <FiMail className="absolute right-5 top-5 text-slate-300" />
                  <input
                    type="email"
                    required
                    placeholder="alex@atelierx.com"
                    className="w-full bg-white/50 border-none rounded-2xl p-5 text-sm font-bold text-[#0f172a] placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500/20 transition-all studio-ambient"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 ml-4">Inquiry Depth</label>
              <textarea
                required
                rows="6"
                placeholder="Describe your architectural vision or technical hurdle..."
                className="bg-white/50 border-none rounded-[2rem] p-6 text-sm font-medium text-[#0f172a] placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500/20 transition-all studio-ambient resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className={`group relative rounded-2xl py-5 px-10 flex items-center justify-center gap-3 overflow-hidden transition-all duration-500 ${
                !userInfo 
                ? "bg-slate-100 text-slate-400 cursor-pointer" 
                : "studio-primary studio-cta"
              }`}
            >
              {!userInfo && <FiLock className="text-sm opacity-50" />}
              <span className="text-[10px] uppercase tracking-[0.4em] font-black z-10">
                {!userInfo 
                  ? "Sign In to Transmit" 
                  : isSubmitting ? "Routing Inquiry..." : "Transmit to AtelierX HQ"}
              </span>
              {userInfo && !isSubmitting && <FiSend className="text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform z-10" />}
              {userInfo && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactTerminal;
