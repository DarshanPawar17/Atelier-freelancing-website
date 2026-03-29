import { LOGIN_ROUTE, SIGNUP_ROUTE } from "../utils/constants";
import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";

const AuthWrapper = ({ type }) => {
  const [cookies, setCookies] = useCookies();
  const [loading, setLoading] = useState(false);

  const [{ showLoginModal, showSignupModal }, dispatch] = useStateProvider();
  const [values, setValues] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { email, password } = values;
      if (!email || !password) {
        toast.error("Please fill all the fields.");
        setLoading(false);
        return;
      }

      // Email validation using regular expression
      const emailPattern = /^\w+@[\w.-]+\.\w{2,4}$/;

      if (!emailPattern.test(email)) {
        toast.error("Please enter a valid email address.");
        setLoading(false);
        return;
      }

      const {
        data: { user, jwt },
      } = await axios.post(
        type === "login" ? LOGIN_ROUTE : SIGNUP_ROUTE,
        values,
        { withCredentials: true }
      );
      setCookies("jwt", jwt);
      dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });
      if (user) {
        let projectedUserInfo = { ...user };
        if (user.profileImage) {
          projectedUserInfo = { ...projectedUserInfo, imageName: user.profileImage };
        }
        dispatch({ type: reducerCases.SET_USER, userInfo: projectedUserInfo });
        toast.success("Welcome to the Atelier!");
      }
      setLoading(false);
    } catch (err) {
      console.error("Auth error:", err);
      if (axios.isAxiosError(err)) {
        const resp = err.response;
        const data = resp?.data;
        
        // Detailed error retrieval for "Safe" usage
        const message = data?.message || data?.error || (resp ? "An error occurred" : "Network Connection Error: Server unreachable on port 5001");
        
        toast.error(message);
      } else {
        toast.error(err?.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAuth = () => {
    dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });
  };

  return (
    <div className="fixed top-0 left-0 z-[100] h-screen w-screen flex justify-center items-center">
      <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-md" onClick={handleCloseAuth}></div>
      
      <div
        className="relative z-[101] w-full max-w-md studio-paper studio-ambient rounded-[2.5rem] studio-ghost-border p-8 md:p-12 bg-white flex flex-col items-center animate-in zoom-in-95 duration-300"
        id="auth-modal"
      >
        <button
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-[#0f172a] hover:bg-slate-100 rounded-full transition-all"
          onClick={handleCloseAuth}
        >
          <AiOutlineCloseCircle size={24} />
        </button>

        <div className="w-full flex flex-col items-center gap-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
               <div className="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center text-white text-2xl font-black">
                A
              </div>
            </div>
            <h3 className="text-3xl font-black text-[#0f172a] tracking-tighter mb-2">
              {type === "login" ? "Welcome Back" : "Join the Atelier"}
            </h3>
            <p className="text-slate-400 text-sm font-medium">
              {type === "login" ? "Continue your architectural journey" : "Start your creative legacy today"}
            </p>
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="relative group">
              <input
                type="text"
                name="email"
                placeholder="Email Address"
                className="w-full py-4 px-6 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium text-[#0f172a]"
                value={values.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative group">
              <input
                type="password"
                placeholder="Password"
                className="w-full py-4 px-6 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium text-[#0f172a]"
                name="password"
                value={values.password}
                onChange={handleChange}
              />
            </div>

            {type === "login" && (
              <div className="flex justify-end">
                <span className="text-indigo-600 text-[11px] font-black uppercase tracking-widest cursor-pointer hover:text-indigo-700">
                  Forgot Security Key?
                </span>
              </div>
            )}

            <button
              className="w-full bg-[#6366f1] text-white py-4 mt-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] studio-ambient hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center"
              onClick={handleClick}
              type="button"
            >
              {loading ? (
                <ThreeDots height={20} width={40} color="#ffffff" visible={true} />
              ) : (
                type === "login" ? "Sign In" : "Create Account"
              )}
            </button>

          </div>

          <div className="pt-8 border-t border-slate-100 w-full text-center">
            <p className="text-sm font-medium text-slate-500">
              {type === "login" ? "First time at the studio?" : "Already a member?"}&nbsp;
              <span
                className="text-indigo-600 font-black cursor-pointer hover:underline"
                onClick={() => {
                  dispatch({
                    type: reducerCases.TOGGLE_SIGNUP_MODAL,
                    showSignupModal: type === "login" ? true : false,
                  });
                  dispatch({
                    type: reducerCases.TOGGLE_LOGIN_MODAL,
                    showLoginModal: type === "login" ? false : true,
                  });
                }}
              >
                {type === "login" ? "Join Now" : "Sign In"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;
