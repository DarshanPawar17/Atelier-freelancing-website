import React, { useState } from "react";
import { FiChevronDown, FiPlus, FiMinus } from "react-icons/fi";

const HelpAccordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => (
        <div 
          key={index} 
          className={`studio-glass rounded-3xl transition-all duration-500 studio-ghost-border ${
            openIndex === index ? "bg-white studio-ambient" : "bg-white/40 hover:bg-white/60"
          }`}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-8 py-6 flex items-center justify-between text-left group"
          >
            <span className={`text-lg font-black tracking-tight transition-colors ${
              openIndex === index ? "text-indigo-500" : "text-[#0f172a]"
            }`}>
              {item.question}
            </span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
              openIndex === index ? "bg-indigo-500 text-white rotate-180" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
            }`}>
              <FiChevronDown />
            </div>
          </button>
          
          <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}>
            <div className="px-8 pb-8 text-slate-500 font-medium leading-relaxed">
              <div className="w-full h-px bg-slate-100 mb-6" />
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HelpAccordion;
