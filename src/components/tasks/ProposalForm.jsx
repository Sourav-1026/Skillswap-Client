"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { authFetch } from "@/lib/api";

export default function ProposalForm({ taskId }) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user)
    return (
      <p className="text-gray-500 italic mt-6 border-t border-[rgba(44,26,14,0.1)] pt-6">
        Log in to submit a proposal.
      </p>
    );
  if (user.role !== "freelancer")
    return (
      <p className="text-gray-500 italic mt-6 border-t border-[rgba(44,26,14,0.1)] pt-6">
        Only freelancers can submit proposals.
      </p>
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/proposals`,
        {
          method: "POST",

          body: JSON.stringify({
            task_id: taskId,
            proposed_budget: Number(budget),
            estimated_days: Number(days),
            cover_note: coverNote,
          }),
        },
      );
      if (res.ok) {
        toast.success("Proposal submitted!");
        setBudget("");
        setDays("");
        setCoverNote("");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to submit proposal");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-[rgba(44,26,14,0.1)]">
      <h3 className="text-2xl font-bold text-accent mb-6">Submit a Proposal</h3>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 bg-accent-text p-3 md:p-6 rounded-2xl border border-[rgba(44,26,14,0.1)]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-shadow-accent mb-2">
              Proposed Budget ($)
            </label>
            <input
              type="number"
              required
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-shadow-accent focus:outline-hidden focus:border-[#C8845A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-shadow-accent mb-2">
              Estimated Days
            </label>
            <input
              type="number"
              required
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-shadow-accent focus:outline-hidden focus:border-[#C8845A]"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-shadow-accent mb-2">
            Cover Note Message
          </label>
          <textarea
            required
            rows="4"
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-shadow-accent focus:outline-hidden focus:border-[#C8845A]"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#C8845A] text-[#2C1A0E] px-8 py-3 rounded-lg font-bold self-start disabled:opacity-50 hover:bg-[#b0724b] transition-colors"
        >
          {loading ? "Submitting..." : "Submit Proposal"}
        </button>
      </form>
    </div>
  );
}
