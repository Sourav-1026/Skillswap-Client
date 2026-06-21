import { getfreelancerProposals } from "@/lib/api/tasks";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Table } from "@heroui/react";
import React from "react";

const FreelancerMyProposalsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  const freelancerEmail = user?.email;
  const res = await getfreelancerProposals(freelancerEmail);

  const statusStyles = {
    Pending: "text-yellow-400",
    Accepted: "text-green-400",
    Rejected: "text-red-400",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-accent mb-6">My Proposals</h1>

      <Table className="bg-accent-text">
        <Table.ScrollContainer>
          <Table.Content
            aria-label="My Proposals"
            className="min-w-150 bg-[#2C1A0E]"
          >
            <Table.Header className="bg-[#2C1A0E]">
              <Table.Column
                isRowHeader
                className="text-[#C8845A] font-semibold"
              >
                Task Title
              </Table.Column>
              <Table.Column className="text-[#C8845A] font-semibold">
                Budget Bid
              </Table.Column>
              <Table.Column className="text-[#C8845A] font-semibold">
                Date Sent
              </Table.Column>
              <Table.Column className="text-[#C8845A] font-semibold">
                Status
              </Table.Column>
            </Table.Header>

            <Table.Body>
              {res?.map((proposal, index) => (
                <Table.Row
                  key={index}
                  className="border-b border-border bg-accent-text"
                >
                  <Table.Cell className="text-[#C8845A]">
                    {proposal.taskTitle}
                  </Table.Cell>
                  <Table.Cell className="text-[#C8845A]">
                    ${proposal.proposedBudget}
                  </Table.Cell>
                  <Table.Cell className="text-[#C8845A]">
                    {new Date(proposal.submittedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className={`font-semibold ${
                        statusStyles[proposal.status] ?? "text-[#C8845A]"
                      }`}
                    >
                      {proposal.status}
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
};

export default FreelancerMyProposalsPage;
