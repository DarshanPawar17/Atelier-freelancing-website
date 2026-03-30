import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import { FiLock, FiShield, FiCheckCircle, FiCreditCard } from "react-icons/fi";
import { GET_GIG_BY_ID_ROUTE, ACCEPT_TASK_ROUTE } from "../utils/constants";

const CheckoutPage = () => {
  const router = useRouter();
  const { gigId } = router.query;
  const [cookies] = useCookies();
  const [taskData, setTaskData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Fake card states
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    if (!gigId) return;
    
    const fetchTask = async () => {
      try {
        const { data } = await axios.get(`${GET_GIG_BY_ID_ROUTE}/${gigId}`);
        setTaskData(data.gig);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch assignment details.");
      }
    };
    fetchTask();
  }, [gigId]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!cardName || cardNumber.length < 16 || !expiry || cvv.length < 3) {
      toast.error("Please fill in valid demo card details.");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate bank connection delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const { data } = await axios.post(
        ACCEPT_TASK_ROUTE,
        { gigId },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${cookies.jwt}` },
        }
      );
      
      toast.success("Payment successful! Assignment Commissioned.");
      router.push(`/buyer/orders/messages/${data.orderId}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Payment synchronization failed.");
      setIsProcessing(false);
    }
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-bold text-[#0f172a] placeholder:text-slate-400 transition-all";
  const labelClass = "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2";

  return (
    <div className="min-h-screen bg-slate-50/50 pt-36 pb-24 px-6 md:px-16 lg:px-24 flex items-center justify-center">
      <div className="max-w-4xl w-full flex flex-col lg:flex-row gap-12 lg:gap-8">
        
        {/* Payment Form Container */}
        <div className="flex-1">
          <div className="mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-2 block">Secure Terminal</span>
            <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tighter">
              Finalize Commission
            </h1>
            <p className="text-slate-500 font-medium mt-4 leading-relaxed">
              Complete your demo payment to officially start the engagement. This is a simulated transaction.
            </p>
          </div>

          <form onSubmit={handlePayment} className="studio-paper bg-white rounded-[3rem] p-8 md:p-12 studio-ambient studio-ghost-border space-y-8 relative overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <FiCreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-black text-[#0f172a] tracking-tight">Payment Method</h3>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Debit / Credit Card</p>
                </div>
              </div>
              <FiLock className="text-slate-300" size={20} />
            </div>

            <div className="space-y-6 relative z-10">
              <div>
                <label className={labelClass}>Cardholder Name</label>
                <input 
                  type="text" 
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="J. Doe" 
                  className={inputClass}
                />
              </div>
              
              <div>
                <label className={labelClass}>Card Number</label>
                <input 
                  type="text" 
                  maxLength={16}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="4000123456789010" 
                  className={inputClass} 
                  style={{ letterSpacing: '0.1em' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Expiry Date</label>
                  <input 
                    type="text" 
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY" 
                    className={inputClass}
                    style={{ letterSpacing: '0.1em' }}
                  />
                </div>
                <div>
                  <label className={labelClass}>CVC Code</label>
                  <input 
                    type="password" 
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="•••" 
                    className={inputClass}
                    style={{ letterSpacing: '0.2em' }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#0f172a] text-white py-6 rounded-2xl text-sm font-black uppercase tracking-[0.2em] studio-ambient hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:bg-[#0f172a] disabled:active:scale-100 mt-4 relative z-10"
            >
              {isProcessing ? (
                <>
                  <ThreeDots height="20" width="40" color="#ffffff" />
                  Processing...
                </>
              ) : (
                `Pay $${taskData?.price || "0.00"}`
              )}
            </button>

            <div className="pt-6 flex justify-center items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
               <FiShield className="text-emerald-400" />
               Demo payment gateway strictly for simulation
            </div>
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mx-20 -my-20 opacity-50 z-0"></div>
          </form>
        </div>

        {/* Order Summary Container */}
        <div className="lg:w-96 flex flex-col gap-8">
          <div className="studio-paper bg-[#0f172a] rounded-[3rem] p-10 studio-ambient text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent"></div>
             <div className="relative z-10 space-y-8">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Order Summary</span>
                  <h2 className="text-3xl font-black mt-2 tracking-tight leading-tight">
                    {taskData ? taskData.title : (
                      <div className="h-8 w-4/5 bg-slate-800 rounded-lg animate-pulse" />
                    )}
                  </h2>
                </div>

                <div className="space-y-4 py-6 border-y border-white/10">
                   <div className="flex justify-between items-center text-sm font-medium text-slate-300">
                      <span>Assignment Price</span>
                      <span className="font-bold text-white">${taskData?.price || "0.00"}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-medium text-slate-300">
                      <span>Platform Fee (Demo)</span>
                      <span className="font-bold text-white">$0.00</span>
                   </div>
                </div>

                <div className="flex justify-between items-end">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total</span>
                   <span className="text-4xl font-black tracking-tighter text-indigo-300">
                     ${taskData?.price || "0.00"}
                   </span>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-4 bg-emerald-50 text-emerald-700 p-6 rounded-3xl mx-4 lg:mx-0">
             <FiCheckCircle size={24} className="shrink-0" />
             <p className="text-xs font-bold leading-relaxed">
               By confirming, you execute a simulated payment workflow designed for demo presentation.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
