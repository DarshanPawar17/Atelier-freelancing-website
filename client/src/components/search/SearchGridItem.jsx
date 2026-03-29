import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { HOST } from "../../utils/constants";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";

function SearchGridItem({ gig }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/gig/${gig.id}`)}
      className="group studio-paper studio-ambient rounded-[2.5rem] studio-ghost-border bg-white overflow-hidden flex flex-col h-[520px] cursor-pointer hover:scale-[1.02] transition-all duration-500"
    >
      {/* Visual Asset Section */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={gig.images?.[0] || "/placeholder.jpg"}
          alt={gig.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[#0f172a] shadow-lg shadow-black/5">
            {gig.category}
          </span>
        </div>
      </div>

      {/* Task Content Section */}
      <div className="p-8 flex flex-col flex-1 justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full border border-slate-100 overflow-hidden shrink-0">
              <Image
                src={gig.createdBy?.profileImage ? (gig.createdBy.profileImage.includes("http") ? gig.createdBy.profileImage : `${HOST}/uploads/${gig.createdBy.profileImage}`) : "/default_avatar.png"}
                alt="Provider"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#0f172a]">{gig.createdBy?.username || "Provider"}</span>
              <span className="text-[9px] uppercase font-bold text-slate-400">Professional Studio</span>
            </div>
          </div>
          
          <h3 className="text-xl font-black text-[#0f172a] tracking-tight line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
            {gig.title}
          </h3>
          <p className="mt-3 text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed opacity-70">
            {gig.shortDesc}
          </p>
        </div>

        {/* Commercial Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Task Price</span>
            <span className="text-2xl font-black text-[#0f172a] tracking-tighter">${gig.price}</span>
          </div>
          
          <button className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:translate-x-1 transition-all">
            <FiArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchGridItem;
