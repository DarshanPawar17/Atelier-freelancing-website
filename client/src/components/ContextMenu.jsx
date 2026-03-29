import { useRouter } from "next/router";
import React from "react";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";

function ContextMenu({ options = [] }) {
  const router = useRouter();
  
  // Defensive check to avoid UI crashes on missing data
  if (!options || options.length === 0) return null;

  return (
    <div
      className="z-[200] bg-white studio-ambient border border-slate-100 w-48 fixed right-5 top-20 rounded-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <ul className="flex flex-col gap-1">
        {options.map(({ name, callback }, index) => {
          return (
            <li
              key={index}
              onClick={callback}
              className="group flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors rounded-xl text-sm font-bold text-slate-700 hover:text-indigo-600"
            >
              <span className="tracking-tight">{name}</span>
              <div className="text-slate-400 group-hover:text-indigo-500 transition-colors">
                {name === "Logout" && <FiLogOut size={18} />}
                {name === "Profile" && <RxAvatar size={18} />}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ContextMenu;
