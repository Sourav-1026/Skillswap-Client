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
    <main className="min-h-screen bg-[#F9F6F0] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/tasks"
          className="text-[#C8845A] hover:underline mb-8 inline-block font-medium"
        >
          &larr; Back to Browse Tasks
        </Link>

        <div className="bg-white rounded-3xl p-8 border border-[rgba(44,26,14,0.1)] shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-[#2C1A0E]">{task.title}</h1>
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${task.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
            >
              {task.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-[#F9F6F0] rounded-2xl">
            <div>
              <p className="text-sm text-gray-500 mb-1">Budget</p>
              <p className="font-bold text-xl text-[#2C1A0E]">${task.budget}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Category</p>
              <p className="font-semibold text-[#C8845A]">{task.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Deadline</p>
              <p className="font-semibold text-[#2C1A0E]">
                {new Date(task.deadline).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Posted By</p>
              <p className="font-semibold text-[#2C1A0E] truncate">
                {task.client_email}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#2C1A0E] mb-4">
              Description
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
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
