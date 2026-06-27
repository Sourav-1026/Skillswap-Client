"use client";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { authClient } from "@/lib/auth-client";
import { useRouter, useParams } from "next/navigation";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { authFetch } from "@/lib/api";

// Load stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

export default function CheckoutPage() {
  const params = useParams();
  const proposalId = params?.proposalId;
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [clientSecret, setClientSecret] = useState("");
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push("/signin");
      return;
    }

    const initCheckout = async () => {
      try {
        // We request a new PaymentIntent from the server.
        // The server will use the proposalId to securely fetch the amount and create the intent.
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/create-intent`,
          {
            method: "POST",
            body: JSON.stringify({ proposalId }),
          },
        );

        if (res.ok) {
          const data = await res.json();
          // We need this clientSecret to initialize the Stripe Elements provider below.
          setClientSecret(data.clientSecret);
          setProposal(data.proposal);
        } else {
          router.push("/dashboard/client"); // fallback if proposal is invalid or already paid
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initCheckout();
  }, [proposalId, session, isPending, router]);

  if (loading || isPending) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center text-xl font-medium text-[#2C1A0E]">
        Loading secure checkout...
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center text-red-500">
        Failed to initialize checkout. Please try again.
      </div>
    );
  }

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#C8845A",
      colorBackground: "#ffffff",
      colorText: "#2C1A0E",
      borderRadius: "8px",
    },
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] py-12 px-6">
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-[rgba(44,26,14,0.1)] shadow-sm">
        <h1 className="text-3xl font-bold text-[#2C1A0E] mb-2">
          Complete Payment
        </h1>
        <p className="text-gray-500 mb-8">
          You are about to securely deposit funds to hire the freelancer.
        </p>

        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
          <CheckoutForm
            proposalId={proposalId}
            amount={proposal?.proposed_budget || 0}
          />
        </Elements>
      </div>
    </div>
  );
}
