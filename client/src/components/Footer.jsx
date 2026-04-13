import Link from "next/link";
import React from "react";
import { FiGithub, FiInstagram, FiLinkedin, FiCode } from "react-icons/fi";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";

const Footer = () => {
  const [{}, dispatch] = useStateProvider();

  const handleJoin = (e) => {
    e.preventDefault();
    dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: true });
  };

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: <FiLinkedin size={18} />,
      href: "https://www.linkedin.com/in/darshan-jagdish-pawar-9b9701298/",
    },
    {
      name: "GitHub",
      icon: <FiGithub size={18} />,
      href: "https://github.com/DarshanPawar17",
    },
    {
      name: "Instagram",
      icon: <FiInstagram size={18} />,
      href: "https://www.instagram.com/darshanpawar__17/",
    },
    {
      name: "Codolio",
      icon: <FiCode size={18} />,
      href: "https://codolio.com/profile/Darshan_Pawar",
    },
  ];

  const platformLinks = [
    { label: "Explore Tasks", href: "/search?q=popular" },
    { label: "Post a Task", href: "/seller/gigs/create" },
  ];

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-10 px-6 md:px-[10%]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

        {/* Brand */}
        <div className="md:col-span-1 flex flex-col gap-5">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-[#0f172a] rounded-lg flex items-center justify-center text-white text-xl font-black">
                A
              </div>
              <span className="text-xl tracking-tighter font-black text-[#0f172a]">
                ATELIER<span className="text-[#6366f1]">X</span>
              </span>
            </div>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed font-medium max-w-xs">
            A curated platform connecting creative and technical professionals
            with ambitious projects.
          </p>
        </div>

        {/* Platform Links */}
        <div className="flex flex-col gap-5">
          <h6 className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">
            Platform
          </h6>
          <ul className="flex flex-col gap-3">
            {platformLinks.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-sm font-semibold text-slate-500 hover:text-[#6366f1] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleJoin}
                className="text-sm font-semibold text-slate-500 hover:text-[#6366f1] transition-colors"
              >
                Create Account
              </button>
            </li>
          </ul>
        </div>

        {/* Support & Resources */}
        <div className="flex flex-col gap-5">
          <h6 className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">
            Support
          </h6>
          <ul className="flex flex-col gap-3">
            <li>
              <Link href="/contact" className="text-sm font-semibold text-slate-500 hover:text-[#6366f1] transition-colors">
                Contact Concierge
              </Link>
            </li>
            <li>
              <Link href="/help" className="text-sm font-semibold text-slate-500 hover:text-[#6366f1] transition-colors">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/status" className="text-sm font-semibold text-slate-500 hover:text-[#6366f1] transition-colors">
                System Status
              </Link>
            </li>
          </ul>
        </div>

        {/* Built By + Socials */}
        <div className="flex flex-col gap-5">
          <h6 className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">
            Built By
          </h6>
          <div>
            <p className="text-sm font-black text-[#0f172a] tracking-tight">Darshan Pawar</p>
            <p className="text-xs text-slate-400 font-medium mt-1">IIIT Sonipat &bull; 2026</p>
          </div>
          <div className="flex items-center gap-4 pt-1">
            {socialLinks.map(({ name, icon, href }) => (
              <Link
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={name}
                className="text-slate-400 hover:text-[#6366f1] transition-colors"
              >
                {icon}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} AtelierX &mdash; Darshan Pawar
        </span>
        <span className="text-[11px] font-black text-indigo-400/40 uppercase tracking-[0.4em]">
          IIIT Sonipat
        </span>
      </div>
    </footer>
  );
};

export default Footer;
