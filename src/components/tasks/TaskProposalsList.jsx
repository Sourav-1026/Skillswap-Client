"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TaskProposalsList({ taskId, taskOwnerEmail }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && session && session.user.email === taskOwnerEmail) {
      fetchProposals();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [session, isPending, taskOwnerEmail]);

  const fetchProposals = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/proposals?taskId=${taskId}`,
        {
          credentials: "include",
        },
      );
      if (res.ok) {
        setProposals(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (proposalId, status) => {
    // If the client decides to accept a proposal, we don't just update the database anymore.
    // Instead, we redirect them to the secure Stripe Checkout page to capture the payment.
    if (status === "accepted") {
      router.push(`/checkout/${proposalId}`);
      return;
    }

    // For rejections, we can directly update the database.
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/proposals/${proposalId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status }),
        },
      );
      if (res.ok) {
        toast.success(`Proposal ${status} successfully!`);
        fetchProposals();
      } else {
        toast.error("Failed to update proposal.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    }
  };

  if (isPending || loading) return null;

  if (!session || session.user.email !== taskOwnerEmail) {
    return null; // Only the task owner sees proposals
  }

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h3 className="text-2xl font-bold text-primary mb-6">
        Received Proposals ({proposals.length})
      </h3>

      {proposals.length === 0 ? (
        <p className="text-secondary italic">No proposals received yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {proposals.map((p) => (
            <div
              key={p._id}
              className="bg-surface-raised p-6 rounded-2xl border border-border"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-primary text-lg">
                    <Link
                      href={`/freelancers/${p.freelancer_email}`}
                      className="hover:underline text-accent"
                    >
                      {p.freelancer_email}
                    </Link>
                  </h4>
                  <p className="text-sm text-secondary mt-1">
                    Budget:{" "}
                    <span className="font-semibold text-primary">
                      ${p.proposed_budget}
                    </span>{" "}
                    | Days:{" "}
                    <span className="font-semibold text-primary">
                      {p.estimated_days}
                    </span>
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    p.status === "accepted"
                      ? "bg-green-500/10 text-green-500"
                      : p.status === "rejected"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-primary mb-2">
                  Cover Letter:
                </p>
                <p className="text-secondary text-sm whitespace-pre-wrap">
                  {p.cover_letter}
                </p>
              </div>

              {p.status === "pending" && (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleAction(p._id, "accepted")}
                    className="flex-1 bg-accent text-accent-text py-2 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
                  >
                    Accept & Hire
                  </button>
                  <button
                    onClick={() => handleAction(p._id, "rejected")}
                    className="flex-1 bg-surface border border-red-500/30 text-red-500 py-2 rounded-lg font-semibold hover:bg-red-500/10 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
