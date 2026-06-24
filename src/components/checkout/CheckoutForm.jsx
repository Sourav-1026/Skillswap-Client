"use client";
import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

export default function CheckoutForm({ proposalId, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Stripe.js has not yet loaded.
    // Make sure to disable form submission until Stripe.js has loaded.
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    // This method securely captures the payment details entered in the PaymentElement.
    // If successful, Stripe automatically redirects the user to the return_url provided.
    // We pass the proposalId in the query string so the success page knows what to verify.
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?proposalId=${proposalId}`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment (e.g. invalid card number, insufficient funds, etc.).
    // Otherwise, your customer will be redirected to your `return_url`.

    if (error) {
      toast.error(error.message || "An unexpected error occurred.");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-[#2C1A0E] text-white py-3 rounded-lg font-bold text-lg hover:bg-[#1a0f08] transition-colors disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : `Pay $${amount}`}
      </button>
    </form>
  );
}
