import React from "react";

const brands = [
  { name: "Airbnb", color: "#FF5A5F" },
  { name: "Google", color: "#4285F4" },
  { name: "Notion", color: "#000000" },
  { name: "Stripe", color: "#635BFF" },
  { name: "Figma", color: "#F24E1E" },
  { name: "Vercel", color: "#000000" },
  { name: "Shopify", color: "#96BF48" },
  { name: "Linear", color: "#5E6AD2" },
  { name: "Framer", color: "#0055FF" },
  { name: "Slack", color: "#4A154B" },
  { name: "Dropbox", color: "#0061FF" },
  { name: "Atlassian", color: "#0052CC" },
];

// Duplicate for seamless infinite loop
const marqueeItems = [...brands, ...brands];

function Companies() {
  return (
    <section className="py-10 bg-white border-y border-slate-100 overflow-hidden">
      {/* Label */}
      <p className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-300 text-center mb-8">
        Affiliated Studios &amp; Teams
      </p>

      {/* Marquee Track */}
      <div className="relative w-full">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, white, transparent)" }} />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, white, transparent)" }} />

        <div className="flex items-center gap-16 marquee-track">
          {marqueeItems.map(({ name, color }, i) => (
            <div
              key={`${name}-${i}`}
              className="flex items-center gap-2.5 shrink-0 group cursor-default"
            >
              {/* Colored dot accent */}
              <span
                className="w-2 h-2 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: color }}
              />
              <span
                className="text-sm font-black tracking-tight text-slate-300 group-hover:text-slate-600 transition-colors duration-300 whitespace-nowrap"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 30s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

export default Companies;
