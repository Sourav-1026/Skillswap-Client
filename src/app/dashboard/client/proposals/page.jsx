"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { Spinner } from "@heroui/react";
import { authFetch } from "@/lib/api";

const ClientProposalsPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [proposalsByTask, setProposalsByTask] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/signin");
      } else if (session.user.role !== "client") {
        router.push(`/dashboard/${session.user.role}`);
      } else {
        fetchProposals(session.user.email);
      }
    }
  }, [session, isPending, router]);

  const fetchProposals = async (email) => {
    try {
      // 1. Fetch client's tasks
      const resTasks = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks?clientEmail=${email}`,
      );
      if (!resTasks.ok) throw new Error("Failed to fetch tasks");
      const dataTasks = await resTasks.json();
      const tasks = dataTasks.tasks || [];

      // 2. Fetch proposals for each task
      // const proposalsPromises = tasks.map(async (task) => {
      //   const res = await fetch(
      //     `${process.env.NEXT_PUBLIC_BASE_URL}/api/proposals?taskId=${task._id}`,
      //     { credentials: "include" },
      //   );
      //   if (res.ok) {
      //     const props = await res.json();
      //     return { task, proposals: props };
      //   }
      //   return { task, proposals: [] };
      // });

      const proposalsPromises = tasks.map(async (task) => {
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/proposals?taskId=${task._id}`,
        );
        if (res.ok) {
          const props = await res.json();
          return { task, proposals: props };
        }
        return { task, proposals: [] };
      });

      const results = await Promise.all(proposalsPromises);
      console.log(results, "From proposals");
      // Filter out tasks with 0 proposals
      setProposalsByTask(results.filter((r) => r.proposals.length > 0));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load proposals.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (proposalId, status) => {
    if (status === "accepted") {
      router.push(`/checkout/${proposalId}`);
      return;
    }

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
        fetchProposals(session.user.email);
      } else {
        toast.error("Failed to update proposal.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    }
  };

  if (isPending || loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="text-accent" size="lg" />
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-8 text-primary">
        Received Proposals
      </h1>

      {proposalsByTask.length === 0 ? (
        <p className="text-secondary italic">
          You haven't received any proposals yet.
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          {proposalsByTask.map(({ task, proposals }) => (
            <div
              key={task._id}
              className="bg-surface border border-border p-6 rounded-2xl shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 pb-4 border-b border-border gap-2">
                <h2 className="text-xl font-bold text-primary">
                  Task:{" "}
                  <Link
                    href={`/tasks/${task._id}`}
                    className="text-accent hover:underline"
                  >
                    {task.title}
                  </Link>
                </h2>
                <span className="text-secondary text-sm font-medium">
                  Task Budget: ${task.budget}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {proposals.map((p) => (
                  <div
                    key={p._id}
                    className="bg-surface-raised border border-border p-5 rounded-xl"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-primary text-lg">
                          <Link
                            href={`/freelancers/${p.freelancer_email}`}
                            className="text-accent hover:underline"
                          >
                            {p.freelancer_email}
                          </Link>
                        </h4>
                        <p className="text-sm text-secondary mt-1">
                          Proposed Budget:{" "}
                          <span className="text-primary font-semibold">
                            ${p.proposed_budget}
                          </span>{" "}
                          | Estimated Days:{" "}
                          <span className="text-primary font-semibold">
                            {p.estimated_days}
                          </span>
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          p.status === "accepted"
                            ? "bg-green-500/10 text-green-500 border border-green-500/20"
                            : p.status === "rejected"
                              ? "bg-red-500/10 text-red-500 border border-red-500/20"
                              : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-primary mb-1">
                        Cover Letter:
                      </p>
                      <p className="text-secondary text-sm whitespace-pre-wrap">
                        {p.cover_letter}
                      </p>
                    </div>

                    {p.status === "pending" && (
                      <div className="flex gap-4 mt-4">
                        <button
                          onClick={() => handleAction(p._id, "accepted")}
                          className="px-6 py-2 bg-accent text-accent-text rounded-lg font-semibold hover:bg-accent-hover transition-colors"
                        >
                          Accept & Hire
                        </button>
                        <button
                          onClick={() => handleAction(p._id, "rejected")}
                          className="px-6 py-2 bg-surface border border-red-500/30 text-red-500 rounded-lg font-semibold hover:bg-red-500/10 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientProposalsPage;
