import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { ORDER_SUCCESS } from "../utils/constants";
import axios from "axios";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { ThreeDots } from "react-loader-spinner";

const SuccessPage = () => {
  const router = useRouter();
  const { payment_intent } = router.query;
  const [cookies] = useCookies();

  useEffect(() => {
    const changeOrderStatus = async () => {
      try {
        await axios.put(
          ORDER_SUCCESS,
          { paymentIntent: payment_intent },
          {
            headers: {
              Authorization: `Bearer ${cookies.jwt}`,
            },
          }
        );
      } catch (err) {
        console.error("Order status update error:", err);
        toast.error("Synchronization error occurred. Please verify your orders.");
      }
    };

    if (payment_intent) {
      changeOrderStatus();
    }

    const redirectTimer = setTimeout(() => {
      if (payment_intent) {
        router.push("/buyer/orders");
      } else {
        router.push("/");
      }
    }, 4000);

    return () => clearTimeout(redirectTimer);
  }, [payment_intent, router, cookies.jwt]);

  return (
    <div className="min-h-screen bg-slate-50/50 pt-36 pb-24 px-6 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="studio-paper studio-ambient rounded-[3rem] studio-ghost-border bg-white p-12 md:p-20 flex flex-col items-center text-center">
          
          <div className="relative mb-8">
             <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
             <div className="relative w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
               <FiCheckCircle size={48} />
             </div>
          </div>

          <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 mb-4">Payment Confirmed</span>
          <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tighter mb-6 leading-tight">
            Order <br/>Successful.
          </h1>
          
          <div className="space-y-4 mb-10 w-full">
            <p className="text-slate-500 font-medium">
              Your gig has been officially hired and is now in progress.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-center gap-3">
               <FiCheckCircle className="text-indigo-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-[#0f172a]">Secure Payment Complete</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3 px-6 py-3 rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <ThreeDots height="20" width="30" color="#6366f1" />
              Redirecting to Orders
            </div>
            
            <button 
              onClick={() => router.push("/buyer/orders")}
              className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all"
            >
              Enter Dashboard Manually
              <FiArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
