import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import { FiLock, FiShield, FiCheckCircle, FiCreditCard, FiZap } from "react-icons/fi";
import { GET_GIG_BY_ID_ROUTE, CREATE_ORDER, VERIFY_PAYMENT } from "../utils/constants";

const CheckoutPage = () => {
  const router = useRouter();
  const { gigId } = router.query;
  const [cookies] = useCookies();
  const [taskData, setTaskData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    if (!gigId) return;
    
    const fetchTask = async () => {
      try {
        const { data } = await axios.get(`${GET_GIG_BY_ID_ROUTE}/${gigId}`);
        setTaskData(data.gig);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch gig details.");
      }
    };
    fetchTask();

    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [gigId]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Create Order on Backend
      const { data: orderData } = await axios.post(
        CREATE_ORDER,
        { gigId },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${cookies.jwt}` },
        }
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AtelierX",
        description: `Order for ${taskData.title}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          // 2. Verify Payment on Backend
          try {
            const { data: verifyData } = await axios.post(
              VERIFY_PAYMENT,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                withCredentials: true,
                headers: { Authorization: `Bearer ${cookies.jwt}` },
              }
            );

            if (verifyData.status === "success") {
              toast.success("Payment successful! Gig Hired.");
              router.push(`/buyer/orders/messages/${verifyData.orderId}`);
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            toast.error("Verification synchronization failed.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: cookies.username || "Guest User",
          email: "test@atelierx.com",
          contact: "9999999999",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay via UPI',
                instruments: [
                  {
                    method: 'upi',
                  },
                ],
              },
            },
            sequence: ['block.upi', 'block.card', 'block.netbanking'],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Failed to initialize payment.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-36 pb-24 px-6 md:px-16 lg:px-24 flex items-center justify-center">
      <div className="max-w-4xl w-full flex flex-col lg:flex-row gap-12 lg:gap-8">
        
        {/* Payment Form Container */}
        <div className="flex-1">
          <div className="mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-2 block">Secure Terminal</span>
            <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tighter">
               Payment Gateway
            </h1>
            <p className="text-slate-500 font-medium mt-4 leading-relaxed">
              Complete your payment via Razorpay to officially hire the freelancer. All transactions are secured with 256-bit encryption.
            </p>
          </div>

          <div className="studio-paper bg-white rounded-[3rem] p-8 md:p-12 studio-ambient studio-ghost-border space-y-8 relative overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <FiCreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-black text-[#0f172a] tracking-tight">Razorpay Secure</h3>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">UPI • Cards • Netbanking</p>
                </div>
              </div>
              <FiLock className="text-slate-300" size={20} />
            </div>

            <div className="space-y-6 relative z-10 py-4">
              <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <FiZap className="text-indigo-500" size={32} />
                </div>
                <h4 className="font-black text-[#0f172a] mb-2">Ready to Hire</h4>
                <p className="text-sm text-slate-500 max-w-[240px]">
                  Click the button below to open the secure payment window.
                </p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-[#0f172a] text-white py-6 rounded-2xl text-sm font-black uppercase tracking-[0.2em] studio-ambient hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:bg-[#0f172a] disabled:active:scale-100 mt-4 relative z-10"
            >
              {isProcessing ? (
                <>
                  <ThreeDots height="20" width="40" color="#ffffff" />
                  Secure Checkout
                </>
              ) : (
                `Pay ₹${taskData?.price || "0.00"}`
              )}
            </button>

            <div className="pt-6 flex justify-center items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
               <FiShield className="text-emerald-400" />
               PCI-DSS Compliant Encryption Active
            </div>
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mx-20 -my-20 opacity-50 z-0"></div>
          </div>
        </div>

        {/* Order Summary Container */}
        <div className="lg:w-96 flex flex-col gap-8">
          <div className="studio-paper bg-[#0f172a] rounded-[3rem] p-10 studio-ambient text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent"></div>
             <div className="relative z-10 space-y-8">
                <div>
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Gig Summary</span>
                   <h2 className="text-3xl font-black mt-2 tracking-tight leading-tight">
                    {taskData ? taskData.title : (
                      <div className="h-8 w-4/5 bg-slate-800 rounded-lg animate-pulse" />
                    )}
                   </h2>
                </div>

                <div className="space-y-4 py-6 border-y border-white/10">
                   <div className="flex justify-between items-center text-sm font-medium text-slate-300">
                      <span>Service Price</span>
                      <span className="font-bold text-white">₹{taskData?.price || "0.00"}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-medium text-slate-300">
                      <span>Gateway Fee</span>
                      <span className="font-bold text-white">₹0.00</span>
                   </div>
                </div>

                <div className="flex justify-between items-end">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Charged</span>
                   <span className="text-4xl font-black tracking-tighter text-indigo-300">
                     ₹{taskData?.price || "0.00"}
                   </span>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-4 bg-indigo-50 text-indigo-700 p-6 rounded-3xl mx-4 lg:mx-0">
             <FiCheckCircle size={24} className="shrink-0" />
             <p className="text-xs font-bold leading-relaxed">
               Payment is held in escrow and released to the freelancer only upon project approval.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
