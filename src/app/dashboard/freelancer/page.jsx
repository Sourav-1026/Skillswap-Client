"use client";
import React, { useEffect, useState } from "react";
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@heroui/react";

const FreelancerPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/signin");
      } else if (session.user.role !== "freelancer") {
        router.push(`/dashboard/${session.user.role}`);
      } else {
        fetchProposals(session.user.email);
      }
    }
  }, [session, isPending, router]);

  const fetchProposals = async (email) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/proposals?freelancerEmail=${email}`,
        { credentials: "include" },
      );
      if (res.ok) {
        const data = await res.json();
        setProposals(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isPending || loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="text-accent" size="lg" />
      </div>
    );

  const totalEarnings = proposals.reduce(
    (acc, p) =>
      p.status === "accepted" ? acc + Number(p.proposed_budget) : acc,
    0,
  );

  const stats = [
    {
      label: "Total Proposals",
      value: proposals.length,
      prefix: "",
      sub: "All time",
      icon: <FiFileText size={18} />,
    },
    {
      label: "Pending Proposals",
      value: proposals.filter((p) => p.status === "pending").length,
      prefix: "",
      sub: "Awaiting response",
      icon: <FiClock size={18} />,
    },
    {
      label: "Accepted Proposals",
      value: proposals.filter((p) => p.status === "accepted").length,
      prefix: "",
      sub: "Confirmed",
      icon: <FiCheckCircle size={18} />,
    },
    {
      label: "Potential Earnings",
      value: totalEarnings,
      prefix: "$",
      sub: "From accepted tasks",
      icon: <FiDollarSign size={18} />,
    },
  ];

  return (
    <div className="p-6">
      <h1
        className="text-2xl font-medium mb-6"
        style={{ color: "var(--color-primary)" }}
      >
        Freelancer Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary">{stat.label}</span>
              <span className="bg-primary/15 text-primary rounded-lg p-1.75 flex items-center justify-center">
                {stat.icon}
              </span>
            </div>
            <div>
              <p className="text-primary text-[28px] font-bold leading-none">
                {stat.prefix}
                {stat.value}
              </p>
              <p className="text-xs text-muted mt-1.5">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-[var(--color-primary)] mb-4">
        My Proposals
      </h2>
      {proposals.length === 0 ? (
        <p className="text-secondary">
          You haven't submitted any proposals yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposals.map((proposal) => (
            <div
              key={proposal._id}
              className="bg-surface p-6 rounded-xl border border-(--color-border) shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-(--color-primary)">
                  Proposal
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${proposal.status === "accepted" ? "bg-green-500/10 text-green-500 border border-green-500/20" : proposal.status === "rejected" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"}`}
                >
                  {proposal.status}
                </span>
              </div>
              <p className="text-sm text-(--color-secondary) mb-4">
                Proposed Budget: ${proposal.proposed_budget} | Estimated Days:{" "}
                {proposal.estimated_days}
              </p>
              <Link
                href={`/tasks/${proposal.task_id}`}
                className="text-(--color-accent) hover:underline text-sm font-medium"
              >
                View Original Task &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancerPage;
