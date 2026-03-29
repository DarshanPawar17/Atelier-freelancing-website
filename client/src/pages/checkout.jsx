import React, { useEffect, useState } from "react";
import { CREATE_ORDER } from "../utils/constants";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import axios from "axios";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import { FiLock, FiShield, FiCheckCircle } from "react-icons/fi";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [cookies] = useCookies();
  const router = useRouter();
  const { gigId } = router.query;

  useEffect(() => {
    const createOrder = async () => {
      try {
        const { data } = await axios.post(
          CREATE_ORDER,
          { gigId },
          {
            headers: {
              Authorization: `Bearer ${cookies.jwt}`,
            },
          }
        );
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Order creation error:", err);
        toast.error("Failed to initialize acquisition portal");
      }
    };

    if (gigId) {
      createOrder();
    }
  }, [gigId, cookies.jwt]);

  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#6366f1',
      colorBackground: '#ffffff',
      colorText: '#0f172a',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '16px',
    },
    rules: {
      '.Input': {
        border: '1px solid #e2e8f0',
        boxShadow: 'none',
      },
      '.Input:focus': {
        border: '1px solid #6366f1',
      },
      '.Label': {
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontSize: '10px',
        color: '#94a3b8',
        marginBottom: '8px',
      }
    }
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-36 pb-24 px-6 md:px-16 lg:px-24 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500">Secure Acquisition</span>
          <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tighter mt-2">Active Checkout</h1>
          <p className="text-slate-500 font-medium mt-4">Finalize your professional engagement for project ID: {gigId?.slice(-6).toUpperCase()}</p>
        </div>

        {/* Payment Surface */}
        <div className="studio-paper studio-ambient rounded-[3rem] studio-ghost-border bg-white p-8 md:p-16 relative overflow-hidden">
          {!clientSecret ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <ThreeDots height="40" width="40" color="#6366f1" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Architecting Secure Portal</span>
            </div>
          ) : (
            <>
              <div className="mb-10 flex items-center justify-between pb-8 border-b border-slate-50">
                <div className="flex items-center gap-3 text-emerald-600">
                  <FiShield size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">Encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <FiLock size={16} />
                </div>
              </div>

              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
              </Elements>

              <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                   <FiCheckCircle className="text-indigo-500" />
                   Fully Managed by Digital Atelier Systems
                 </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
