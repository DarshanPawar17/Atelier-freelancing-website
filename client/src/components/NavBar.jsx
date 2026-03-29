import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoSearchOutline } from "react-icons/io5";
import { RiCloseLine, RiMenu3Line } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";
import ContextMenu from "./ContextMenu";
import { useCookies } from "react-cookie";
import axios from "axios";
import { GET_USER_INFO, HOST } from "../utils/constants";
import Image from "next/image";
import { toast } from "react-toastify";

const NavBar = () => {
  const [cookies] = useCookies(["jwt"]);
  const router = useRouter();
  const [navFixed, setNavFixed] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const [{ showLoginModal, showSignupModal, userInfo, isSeller }, dispatch] =
    useStateProvider();

  useEffect(() => {
    const positionNavbar = () => {
      window.scrollY > 10 ? setNavFixed(true) : setNavFixed(false);
    };
    window.addEventListener("scroll", positionNavbar);
    return () => window.removeEventListener("scroll", positionNavbar);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogin = () => {
    dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: false });
    dispatch({ type: reducerCases.TOGGLE_LOGIN_MODAL, showLoginModal: true });
  };

  const handleSignup = () => {
    dispatch({ type: reducerCases.TOGGLE_LOGIN_MODAL, showLoginModal: false });
    dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: true });
  };

  const handleOrdersNavigate = () => {
    if (isSeller) router.push("/seller/gigs");
    else router.push("/buyer/orders");
  };

  const handleModeSwitch = () => {
    dispatch({ type: reducerCases.SWITCH_MODE });
    if (isSeller) router.push("/buyer/orders");
    else router.push("/seller");
  };

  useEffect(() => {
    if (cookies.jwt && !userInfo) {
      const getUserInfo = async () => {
        try {
          const { data: { user } } = await axios.post(GET_USER_INFO, {}, {
            headers: { Authorization: `Bearer ${cookies.jwt}` },
          });
          let projectedUserInfo = { ...user };
          if (user.profileImage) {
            projectedUserInfo = { ...projectedUserInfo, imageName: user.profileImage };
          }
          dispatch({ type: reducerCases.SET_USER, userInfo: projectedUserInfo });
        } catch (err) {
          console.log(err);
        }
      };
      getUserInfo();
    }
  }, [cookies.jwt, dispatch, userInfo]);

  return (
    <>
      <nav
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] 
          ${navFixed 
            ? "top-4 w-[95%] md:w-[85%] lg:w-[75%] max-w-7xl studio-glass studio-ambient rounded-full studio-ghost-border px-8 py-3" 
            : "top-0 w-full px-6 md:px-16 py-6 bg-transparent"}`}
      >
        <div className="flex items-center justify-between gap-8 font-semibold">
          {/* Logo Section */}
          <Link href="/" className="transition-transform hover:scale-105 active:scale-95 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0f172a] rounded-lg flex items-center justify-center text-white text-xl font-black">
                A
              </div>
              <span className="text-xl tracking-tighter font-black text-[#0f172a]">
                ATELIER<span className="text-[#6366f1]">X</span>
              </span>
            </div>
          </Link>

          {/* Search Section */}
          {navFixed && (
            <div className="hidden lg:flex flex-1 max-w-md studio-ghost-border rounded-full bg-slate-50/50 px-4 py-1.5 items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20">
              <IoSearchOutline className="text-slate-400 text-lg" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="bg-transparent text-sm w-full outline-none text-[#0f172a] font-medium placeholder:text-slate-400"
                value={searchData}
                onChange={(e) => setSearchData(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && router.push(`/search?q=${searchData}`)}
              />
            </div>
          )}

          {/* Desktop Links */}
          <div className="flex items-center gap-6 lg:gap-10">
            <ul className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500">
              <li className="hover:text-[#6366f1] transition-colors cursor-pointer">
                <Link href="/search?q=popular">Explore Tasks</Link>
              </li>
              {userInfo ? (
                <>
                  {isSeller && (
                    <li className="hover:text-[#6366f1] transition-colors cursor-pointer" onClick={() => router.push("/seller/gigs/create")}>
                      Post a Task
                    </li>
                  )}
                  <li className="hover:text-[#6366f1] transition-colors cursor-pointer" onClick={handleOrdersNavigate}>
                    My Tasks
                  </li>
                  <li className="cursor-pointer px-4 py-1.5 bg-slate-100 text-[#0f172a] rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors" onClick={handleModeSwitch}>
                    {isSeller ? "Switch to Hiring" : "Switch to Tasking"}
                  </li>
                </>
              ) : (
                <li className="hover:text-[#6366f1] transition-colors cursor-pointer" onClick={handleSignup}>
                  Post Tasks
                </li>
              )}
            </ul>

            <div className="flex items-center gap-4 shrink-0">
              {userInfo ? (
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-full border-2 border-slate-100 p-0.5 cursor-pointer hover:border-indigo-400 transition-all active:scale-90 overflow-hidden"
                    onClick={(e) => { e.stopPropagation(); setIsContextMenuVisible(!isContextMenuVisible); }}
                  >
                    {userInfo.imageName ? (
                      <Image
                        src={userInfo.imageName.includes("http") ? userInfo.imageName : `${HOST}/uploads/${userInfo.imageName}`}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[#0f172a]">
                        {userInfo.email[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  {isContextMenuVisible && (
                    <ContextMenu
                      options={[
                        { name: "My Profile", callback: () => { setIsContextMenuVisible(false); router.push("/profile"); } },
                        { name: "Logout", callback: () => { setIsContextMenuVisible(false); router.push("/logout"); } },
                      ]}
                    />
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-6">
                  <button onClick={handleLogin} className="text-sm tracking-tight text-slate-600 hover:text-[#0f172a] font-bold transition-colors">
                    Sign In
                  </button>
                  <button onClick={handleSignup} className="studio-cta bg-[#6366f1] text-white text-[11px] uppercase tracking-widest font-black px-8 py-3 rounded-full studio-ambient">
                    Join Today
                  </button>
                </div>
              )}
              {/* Mobile Menu Trigger */}
              <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-[#0f172a] hover:bg-slate-100 rounded-full transition-colors">
                {isOpen ? <RiCloseLine size={24} /> : <RiMenu3Line size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#0f172a]/20 backdrop-blur-sm z-[60] md:hidden" onClick={() => setIsOpen(false)} />
      )}
      <div
        ref={mobileMenuRef}
        className={`fixed top-4 right-4 bottom-4 w-[85%] max-w-xs studio-glass studio-ambient z-[70] rounded-[2.5rem] p-8 transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] md:hidden studio-ghost-border ${isOpen ? "translate-x-0" : "translate-x-[120%]"}`}
      >
        <button className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full transition-colors" onClick={() => setIsOpen(false)}>
          <RxCross1 size={20} />
        </button>
        <div className="flex flex-col h-full pt-12">
          <div className="mb-10">
            <input
              type="text"
              placeholder="Search Tasks..."
              className="w-full p-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none"
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (router.push(`/search?q=${searchData}`), setIsOpen(false))}
            />
          </div>
          <ul className="flex flex-col gap-2">
            {!userInfo ? (
              <>
                <li className="p-4 text-[#0f172a] font-bold hover:bg-white/50 rounded-2xl cursor-pointer" onClick={() => { router.push("/search?q=popular"); setIsOpen(false); }}>Explore Tasks</li>
                <li className="p-4 text-[#0f172a] font-bold hover:bg-white/50 rounded-2xl cursor-pointer" onClick={() => { handleSignup(); setIsOpen(false); }}>Become a Provider</li>
                <li className="p-4 text-[#0f172a] font-bold hover:bg-white/50 rounded-2xl cursor-pointer" onClick={() => { handleLogin(); setIsOpen(false); }}>Sign In</li>
                <button onClick={() => { handleSignup(); setIsOpen(false); }} className="w-full mt-4 bg-[#6366f1] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Join Today</button>
              </>
            ) : (
              <>
                <li onClick={() => { router.push("/profile"); setIsOpen(false); }} className="p-4 text-[#0f172a] font-bold hover:bg-white/50 rounded-2xl">My Profile</li>
                <li onClick={() => { handleOrdersNavigate(); setIsOpen(false); }} className="p-4 text-[#0f172a] font-bold hover:bg-white/50 rounded-2xl">Active Tasks</li>
                <li onClick={() => { handleModeSwitch(); setIsOpen(false); }} className="p-4 text-[#6366f1] font-black hover:bg-white/50 rounded-2xl">{isSeller ? "Switch to Hiring" : "Switch to Tasking"}</li>
                <li onClick={() => { router.push("/logout"); setIsOpen(false); }} className="p-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl mt-4">Logout</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavBar;
