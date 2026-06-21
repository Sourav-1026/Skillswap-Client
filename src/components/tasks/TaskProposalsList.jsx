"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Link from "next/link";

export default function TaskProposalsList({ taskId, taskOwnerEmail }) {
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

  if (isPending || loading) return null; // Don't show anything while loading or if not owner

  if (!session || session.user.email !== taskOwnerEmail) {
    return null; // Only the task owner sees proposals
  }

  return (
    <div className="mt-12 border-t border-[rgba(44,26,14,0.1)] pt-8">
      <h3 className="text-2xl font-bold text-[#2C1A0E] mb-6">
        Received Proposals ({proposals.length})
      </h3>

      {proposals.length === 0 ? (
        <p className="text-gray-500 italic">No proposals received yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {proposals.map((p) => (
            <div
              key={p._id}
              className="bg-[#F9F6F0] p-6 rounded-2xl border border-[rgba(44,26,14,0.1)]"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-[#2C1A0E] text-lg">
                    <Link
                      href={`/freelancers/${p.freelancer_email}`}
                      className="hover:underline text-[#C8845A]"
                    >
                      {p.freelancer_email}
                    </Link>
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Budget:{" "}
                    <span className="font-semibold text-[#2C1A0E]">
                      ${p.proposed_budget}
                    </span>{" "}
                    | Days:{" "}
                    <span className="font-semibold text-[#2C1A0E]">
                      {p.estimated_days}
                    </span>
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    p.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : p.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-[#2C1A0E] mb-2">
                  Cover Letter:
                </p>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {p.cover_letter}
                </p>
              </div>

              {p.status === "pending" && (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleAction(p._id, "accepted")}
                    className="flex-1 bg-[#2C1A0E] text-white py-2 rounded-lg font-semibold hover:bg-[#1a0f08] transition-colors"
                  >
                    Accept & Hire
                  </button>
                  <button
                    onClick={() => handleAction(p._id, "rejected")}
                    className="flex-1 bg-white border border-red-200 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors"
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
