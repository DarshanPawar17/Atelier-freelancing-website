import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { FiLock } from "react-icons/fi";
import { ThreeDots } from "react-loader-spinner";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          toast.success("Transaction finalized successfully");
          break;
        case "processing":
          toast.info("Transaction processing by Atelier systems");
          break;
        case "requires_payment_method":
          toast.error("Transaction declined. Please verify method.");
          break;
        default:
          toast.error("System synchronization failed.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      toast.error(error.message);
    } else {
      toast.error("An unexpected architectural error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="w-full space-y-8">
      <div className="space-y-6">
        <LinkAuthenticationElement
          id="link-authentication-element"
          onChange={(e) => setEmail(e.target.value)}
        />
        <PaymentElement id="payment-element" options={paymentElementOptions} />
      </div>
      
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full bg-[#0f172a] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] studio-ambient hover:bg-[#6366f1] transition-all active:scale-95 disabled:opacity-20 flex justify-center items-center gap-3"
      >
        {isLoading ? (
          <ThreeDots height="20" width="40" color="#fff" />
        ) : (
          <>
            <FiLock size={14} />
            Finalize Acquisition
          </>
        )}
      </button>
    </form>
  );
}
