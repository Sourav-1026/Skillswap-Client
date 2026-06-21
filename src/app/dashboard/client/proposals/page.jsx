import ProposalCard from "@/components/dashboard/ProposalCard";
import { getClientProposals } from "@/lib/api/tasks";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";

const ClientProposalsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  const clientEmail = user?.email;
  const resData = await getClientProposals(clientEmail);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#F5E6D3] mb-6">
        Received Proposals
      </h1>

      {resData?.length === 0 ? (
        <p className="text-text-secondary">No proposals yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {resData?.map((proposal) => (
            <ProposalCard key={proposal._id} proposal={proposal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientProposalsPage;
