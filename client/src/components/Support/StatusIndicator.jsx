import React from "react";

export const StatusBadge = ({ status = "operational" }) => {
  const styles = {
    operational: "bg-emerald-500",
    degraded: "bg-amber-500",
    outage: "bg-rose-500",
    maintenance: "bg-indigo-500",
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex h-3 w-3">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${styles[status]}`}></span>
        <span className={`relative inline-flex rounded-full h-3 w-3 ${styles[status]}`}></span>
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#0f172a]">
        {status}
      </span>
    </div>
  );
};

export const UptimeBar = ({ days = 30 }) => {
  return (
    <div className="flex gap-1 h-8 items-end group">
      {[...Array(days)].map((_, i) => (
        <div 
          key={i} 
          className="flex-1 bg-emerald-500/20 rounded-t-sm transition-all duration-300 hover:bg-emerald-500 hover:h-full h-[60%] cursor-help"
          title={`Status: Operational - Day ${days - i}`}
        />
      ))}
    </div>
  );
};

export const ServiceCard = ({ name, desc, status = "operational" }) => {
  return (
    <div className="studio-glass studio-ghost-border p-8 rounded-[2rem] bg-white/40 studio-ambient hover:bg-white transition-all duration-500 group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-xl font-black text-[#0f172a] tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{name}</h4>
          <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">{desc}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="mt-8">
        <div className="flex justify-between items-end mb-2">
           <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">30 Day History</span>
           <span className="text-xs font-black text-emerald-500">99.98%</span>
        </div>
        <UptimeBar />
      </div>
    </div>
  );
};
