import React from "react";
import Link from "next/link";
import ProposalForm from "@/components/tasks/ProposalForm";
import TaskProposalsList from "@/components/tasks/TaskProposalsList";
import LeaveReview from "@/components/tasks/LeaveReview";

export const dynamic = "force-dynamic";

export default async function TaskDetailsPage({ params }) {
  const { id } = await params;
  let task = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${id}`,
      { cache: "no-store" },
    );
    if (res.ok) {
      task = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch task details:", error);
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Task not found
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/tasks"
          className="text-accent hover:underline mb-8 inline-block font-medium"
        >
          &larr; Back to Browse Tasks
        </Link>

        {/* Main task container */}
        <div className="bg-surface rounded-3xl p-8 border border-border shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-primary">{task.title}</h1>
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${task.status === "open" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-surface-raised border border-border text-secondary"}`}
            >
              {task.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-surface-raised border border-border rounded-2xl">
            <div>
              <p className="text-sm text-secondary mb-1">Budget</p>
              <p className="font-bold text-xl text-primary">${task.budget}</p>
            </div>
            <div>
              <p className="text-sm text-secondary mb-1">Category</p>
              <p className="font-semibold text-accent">{task.category}</p>
            </div>
            <div>
              <p className="text-sm text-secondary mb-1">Deadline</p>
              <p className="font-semibold text-primary">
                {new Date(task.deadline).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary mb-1">Posted By</p>
              <p className="font-semibold text-primary truncate">
                {task.client_email}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-primary mb-4">Description</h3>
            <p className="text-secondary whitespace-pre-wrap leading-relaxed">
              {task.description}
            </p>
          </div>

          {task.status === "open" && <ProposalForm taskId={task._id} />}
          {task.status === "Completed" && (
            <LeaveReview taskId={task._id} taskOwnerEmail={task.client_email} />
          )}

          <TaskProposalsList
            taskId={task._id}
            taskOwnerEmail={task.client_email}
          />
        </div>
      </div>
    </main>
  );
}
