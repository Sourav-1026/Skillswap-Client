"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent");
  const proposalId = searchParams.get("proposalId");

  const [status, setStatus] = useState("processing");

  useEffect(() => {
    if (!paymentIntent || !proposalId) {
      setStatus("error");
      return;
    }

    const confirmPayment = async () => {
      try {
        // Stripe redirects the user here with a payment_intent in the URL.
        // We must send this to our backend to verify it actually succeeded and hasn't been tampered with.
        // The backend will also mark the proposal as 'accepted' and store the payment record.
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/proposals/${proposalId}/confirm-payment`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ paymentIntentId: paymentIntent }),
          },
        );

        if (res.ok) {
          setStatus("success");
          toast.success("Payment successful! Proposal accepted.");
        } else {
          setStatus("error");
          toast.error("Failed to verify payment. Please contact support.");
        }
      } catch (error) {
        console.error("Payment confirmation failed:", error);
        setStatus("error");
      }
    };

    confirmPayment();
  }, [paymentIntent, proposalId]);

  if (status === "processing") {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#2C1A0E] mb-4">
          Verifying Payment...
        </h2>
        <p className="text-gray-500">
          Please wait while we confirm your transaction securely.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Verification Failed
        </h2>
        <p className="text-gray-500 mb-6">
          There was an issue verifying your payment. If you were charged, please
          contact support.
        </p>
        <Link
          href="/dashboard/client"
          className="inline-block bg-[#2C1A0E] text-white px-6 py-2 rounded-lg font-medium"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-[#2C1A0E] mb-4">
        Payment Successful!
      </h2>
      <p className="text-gray-600 mb-8">
        You have successfully deposited the funds and hired the freelancer. The
        task is now officially <strong>In Progress</strong>.
      </p>
      <Link
        href="/dashboard/client/tasks"
        className="inline-block bg-[#2C1A0E] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1a0f08] transition-colors"
      >
        Go to My Tasks
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[rgba(44,26,14,0.1)] shadow-sm">
        <Suspense
          fallback={<div className="text-center text-gray-500">Loading...</div>}
        >
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
