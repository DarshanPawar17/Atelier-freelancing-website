import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { IoSearchOutline } from "react-icons/io5";
import { RiCloseLine, RiMenu3Line } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";
import { GET_USER_INFO } from "../utils/constants";
import ContextMenu from "./ContextMenu";

const NavBar = () => {
  const router = useRouter();
  const [cookies] = useCookies();
  const [isLoaded] = useState(true);
  const [navFixed, setNavFixed] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const [{ showLoginModal, showSignupModal, isSeller, userInfo }, dispatch] =
    useStateProvider();

  const handleLogin = () => {
    if (showSignupModal) {
      dispatch({
        type: reducerCases.TOGGLE_SIGNUP_MODAL,
        showSignupModal: false,
      });
    }
    dispatch({
      type: reducerCases.TOGGLE_LOGIN_MODAL,
      showLoginModal: true,
    });
  };

  const handleSignup = () => {
    if (showLoginModal) {
      dispatch({
        type: reducerCases.TOGGLE_LOGIN_MODAL,
        showLoginModal: false,
      });
    }
    dispatch({
      type: reducerCases.TOGGLE_SIGNUP_MODAL,
      showSignupModal: true,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
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

  const links = [
    { linkName: "AtelierX Business", handler: "/#business", type: "link" },
    { linkName: "Explore", handler: "/search?q=popular", type: "link" },
    { linkName: "Become a Freelancer", handler: handleSignup, type: "button" },
    { linkName: "Sign in", handler: handleLogin, type: "button" },
    { linkName: "Join", handler: handleSignup, type: "button2" },
  ];

  useEffect(() => {
    const positionNavbar = () => {
      window.scrollY > 20 ? setNavFixed(true) : setNavFixed(false);
    };
    window.addEventListener("scroll", positionNavbar);
    return () => window.removeEventListener("scroll", positionNavbar);
  }, []);

  const handleOrdersNavigate = () => {
    if (isSeller) router.push("/seller/orders");
    else router.push("/buyer/orders");
  };

  const handleModeSwitch = () => {
    if (isSeller) {
      dispatch({ type: reducerCases.SWITCH_MODE });
      router.push("/buyer/orders");
    } else {
      dispatch({ type: reducerCases.SWITCH_MODE });
      router.push("/seller");
    }
  };

  useEffect(() => {
    if (!cookies.jwt) return;

    const getUserInfo = async () => {
      try {
        const {
          data: { user },
        } = await axios.post(
          GET_USER_INFO,
          {},
          {
            headers: {
              Authorization: `Bearer ${cookies.jwt}`,
            },
          },
        );
        let projectedUserInfo = { ...user };
        if (user.profileImage) {
          projectedUserInfo = {
            ...projectedUserInfo,
            imageName: user.profileImage,
          };
        }
        delete projectedUserInfo.profileImage;
        dispatch({
          type: reducerCases.SET_USER,
          userInfo: projectedUserInfo,
        });
        if (user.isProfileInfoSet === false && router.pathname !== "/profile") {
          router.push("/profile");
        }
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong");
      }
    };

    getUserInfo();
  }, [cookies.jwt, dispatch, router]);

  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  useEffect(() => {
    const clickListener = (e) => {
      e.stopPropagation();
      if (isContextMenuVisible) setIsContextMenuVisible(false);
    };
    if (isContextMenuVisible) {
      window.addEventListener("click", clickListener);
    }
    return () => {
      window.removeEventListener("click", clickListener);
    };
  }, [isContextMenuVisible]);

  const ContextMenuData = [
    {
      name: "Manage Gigs",
      callback: (e) => {
        e.stopPropagation();
        setIsContextMenuVisible(false);
        router.push("/seller/gigs");
      },
    },
    {
      name: "Profile",
      callback: (e) => {
        e.stopPropagation();
        setIsContextMenuVisible(false);
        router.push("/profile");
      },
    },
    {
      name: "Logout",
      callback: (e) => {
        e.stopPropagation();
        setIsContextMenuVisible(false);
        router.push("/logout");
      },
    },
  ];

  return (
    <>
      {isLoaded && (
        <>
          <nav
            className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              navFixed
                ? "top-4 w-[calc(100%-1.5rem)] md:w-[min(95vw,1240px)] studio-glass studio-ambient rounded-full studio-ghost-border px-6 md:px-10 py-3"
                : "top-0 w-full px-6 md:px-16 py-6 bg-transparent"
            } flex justify-between items-center`}
          >
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
                  <div className="w-8 h-8 bg-[#0f172a] rounded-lg flex items-center justify-center text-white text-xl font-black">
                    A
                  </div>
                  <span className="text-xl tracking-tighter font-black text-[#0f172a]">
                    ATELIER<span className="text-[#6366f1]">X</span>
                  </span>
                </div>
              </Link>
            </div>

            <div className="hidden lg:block flex-1 max-w-md mx-10">
              <div className={`relative transition-all duration-500 ${navFixed ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5f6b66] text-xl" />
                <input
                  type="text"
                  placeholder="Search service..."
                  className="w-full py-2 pl-12 pr-4 bg-white/40 border border-[rgba(191,201,195,0.2)] rounded-full focus:outline-none focus:bg-white/80 transition-all"
                  value={searchData}
                  onChange={(e) => setSearchData(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && router.push(`/search?q=${searchData}`)}
                />
              </div>
            </div>

            <div className="hidden md:block">
              {!userInfo ? (
                <ul className="flex gap-8 items-center">
                  {links.map(({ linkName, handler, type }) => (
                    <li
                      key={linkName}
                      className="shrink-0 text-sm font-semibold tracking-wide transition-all duration-300"
                    >
                      {type === "link" && (
                        <Link href={handler} className="text-[#191c1e] hover:text-[#003527] opacity-70 hover:opacity-100">
                          {linkName}
                        </Link>
                      )}
                      {type === "button" && (
                        <button onClick={handler} className="text-[#191c1e] hover:text-[#003527] opacity-70 hover:opacity-100">
                          {linkName}
                        </button>
                      )}
                      {type === "button2" && (
                        <button
                          onClick={handler}
                          className="studio-primary studio-cta py-2.5 px-8 rounded-full text-sm font-bold studio-ambient"
                        >
                          {linkName}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="flex gap-8 items-center">
                  {isSeller && (
                    <li
                      className="cursor-pointer text-[#5f6b66] hover:text-[#003527] text-sm font-semibold transition-colors"
                      onClick={() => router.push("/seller/gigs/create")}
                    >
                      Create
                    </li>
                  )}
                  <li
                    className="cursor-pointer text-[#5f6b66] hover:text-[#003527] text-sm font-semibold transition-colors"
                    onClick={() => router.push("/search?q=popular")}
                  >
                    Explore Gigs
                  </li>
                  <li
                    className="cursor-pointer text-[#5f6b66] hover:text-[#003527] text-sm font-semibold transition-colors"
                    onClick={handleOrdersNavigate}
                  >
                    Orders
                  </li>
                  <li
                    className="cursor-pointer px-4 py-1.5 bg-[#f2f4f6] text-[#191c1e] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#e0e3e5] transition-colors"
                    onClick={handleModeSwitch}
                  >
                    {isSeller ? "Client Mode" : "Freelancer Mode"}
                  </li>
                  <li
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsContextMenuVisible(true);
                    }}
                  >
                    {userInfo?.imageName ? (
                      <div className="p-0.5 rounded-full border border-[rgba(0,53,39,0.1)]">
                        <Image
                          src={userInfo.imageName}
                          alt="Profile"
                          width={36}
                          height={36}
                          className="rounded-full"
                        />
                      </div>
                    ) : (
                      <div className="bg-[#003527] h-9 w-9 flex items-center justify-center rounded-full text-white font-bold text-sm">
                        {userInfo?.email?.[0].toUpperCase()}
                      </div>
                    )}
                  </li>
                </ul>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-[#191c1e] hover:bg-[#f2f4f6] rounded-full transition-colors"
              >
                {isOpen ? <RiCloseLine size={24} /> : <RiMenu3Line size={24} />}
              </button>
            </div>
          </nav>

          {/* Mobile Overlay */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-[#f7f9fb]/80 backdrop-blur-sm z-[60] md:hidden animate-in fade-in duration-300"
              onClick={() => setIsOpen(false)}
            />
          )}

          <div
            ref={mobileMenuRef}
            className={`fixed top-4 right-4 bottom-4 w-[85%] max-w-xs studio-glass studio-ambient z-[70] rounded-3xl p-8 transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] md:hidden studio-ghost-border ${
              isOpen ? "translate-x-0" : "translate-x-[120%]"
            }`}
          >
            <button
              className="absolute right-6 top-6 p-2 hover:bg-[#f2f4f6] rounded-full transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <RxCross1 size={20} />
            </button>
            <div className="h-full flex flex-col pt-12">
              <div className="mb-10">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full p-4 bg-white/50 border border-[rgba(191,201,195,0.2)] rounded-2xl focus:outline-none"
                  value={searchData}
                  onChange={(e) => setSearchData(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (router.push(`/search?q=${searchData}`), setIsOpen(false))}
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                <ul className="flex flex-col gap-2">
                  {!userInfo ? (
                    links.map(({ linkName, handler, type }) => (
                      <li key={linkName}>
                        {type === "button2" ? (
                          <button
                            onClick={() => { handler(); setIsOpen(false); }}
                            className="w-full mt-4 studio-primary studio-cta py-4 rounded-2xl font-bold studio-ambient"
                          >
                            {linkName}
                          </button>
                        ) : (
                          <div
                            onClick={() => { if (typeof handler === "string") router.push(handler); else handler(); setIsOpen(false); }}
                            className="w-full p-4 text-[#191c1e] font-semibold hover:bg-white/50 rounded-2xl transition-all cursor-pointer"
                          >
                            {linkName}
                          </div>
                        )}
                      </li>
                    ))
                  ) : (
                    <>
                      <li onClick={() => (router.push("/profile"), setIsOpen(false))} className="w-full p-4 text-[#191c1e] font-semibold hover:bg-white/50 rounded-2xl">Profile</li>
                      {isSeller && <li onClick={() => (router.push("/seller/gigs"), setIsOpen(false))} className="w-full p-4 text-[#191c1e] font-semibold hover:bg-white/50 rounded-2xl">Manage Gigs</li>}
                      <li onClick={() => (router.push("/search?q=popular"), setIsOpen(false))} className="w-full p-4 text-[#191c1e] font-semibold hover:bg-white/50 rounded-2xl">Explore Gigs</li>
                      <li onClick={() => { handleOrdersNavigate(); setIsOpen(false); }} className="w-full p-4 text-[#191c1e] font-semibold hover:bg-white/50 rounded-2xl">Orders</li>
                      <li onClick={() => { handleModeSwitch(); setIsOpen(false); }} className="w-full p-4 text-[#1DBF73] font-bold hover:bg-white/50 rounded-2xl">{isSeller ? "Switch to Client" : "Switch to Freelancer"}</li>
                      <li onClick={() => (router.push("/logout"), setIsOpen(false))} className="w-full p-4 text-red-500 font-semibold hover:bg-red-50 rounded-2xl mt-4">Logout</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {isContextMenuVisible && <ContextMenu options={ContextMenuData} />}
        </>
      )}
    </>
  );
};

export default NavBar;
