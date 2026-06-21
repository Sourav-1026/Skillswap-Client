import { getfreelancerProposals } from "@/lib/api/tasks";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";
import Link from "next/link";

const FreelancerMyProposalsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  const freelancerEmail = user?.email;

  let proposals = [];
  try {
    proposals = (await getfreelancerProposals(freelancerEmail)) || [];
  } catch (error) {
    console.error("Error fetching proposals:", error);
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[#2C1A0E] mb-8">My Proposals</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-[rgba(44,26,14,0.1)] overflow-hidden">
        {proposals.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            You haven't submitted any proposals yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9F6F0] border-b border-[rgba(44,26,14,0.1)]">
                  <th className="p-4 font-semibold text-[#2C1A0E]">Task ID</th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">Budget</th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">
                    Estimated Days
                  </th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">Status</th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">Date</th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">Action</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((proposal) => (
                  <tr
                    key={proposal._id}
                    className="border-b border-[rgba(44,26,14,0.05)] hover:bg-[#F9F6F0] transition-colors"
                  >
                    <td className="p-4 text-sm font-mono text-gray-600 truncate max-w-[120px]">
                      {proposal.task_id}
                    </td>
                    <td className="p-4 font-bold text-[#2C1A0E]">
                      ${proposal.proposed_budget}
                    </td>
                    <td className="p-4 text-gray-600">
                      {proposal.estimated_days} days
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          proposal.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : proposal.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {proposal.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(
                        proposal.submitted_at || Date.now(),
                      ).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/tasks/${proposal.task_id}`}
                        className="text-[#C8845A] font-semibold hover:underline text-sm"
                      >
                        View Task
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerMyProposalsPage;
