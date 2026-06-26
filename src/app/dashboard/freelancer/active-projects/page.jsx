"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { Spinner } from "@heroui/react";

export default function ActiveProjectsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/signin");
      } else if (session.user.role !== "freelancer") {
        router.push(`/dashboard/${session.user.role}`);
      } else {
        fetchActiveTasks(session.user.email);
      }
    }
  }, [session, isPending, router]);

  const fetchActiveTasks = async (email) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/freelancer/${email}`,
        {
          credentials: "include",
        },
      );
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitDeliverable = async (taskId) => {
    const url = prompt(
      "Please enter the URL for your deliverable (e.g. GitHub repo, Google Doc):",
    );
    if (!url) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            deliverable_url: url,
            status: "Completed",
          }),
        },
      );
      if (res.ok) {
        toast.success("Deliverable submitted and task marked as completed!");
        fetchActiveTasks(session.user.email);
      } else {
        toast.error("Failed to submit deliverable.");
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
      <div className="mb-6">
        <Link
          href="/dashboard/freelancer"
          className="text-[var(--color-accent)] hover:underline mb-4 inline-block font-medium"
        >
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Active & Completed Projects
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Submit deliverables and track your assigned work.
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 text-center">
          <p className="text-[var(--color-text-secondary)]">
            You don't have any assigned projects yet.
          </p>
          <Link
            href="/tasks"
            className="inline-block mt-4 px-6 py-2 bg-[var(--color-accent)] text-white rounded-lg font-medium hover:bg-opacity-90"
          >
            Browse Tasks
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border)] shadow-sm flex flex-col h-full"
            >
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                    {task.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      task.status === "Completed"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                <div className="mb-4 text-sm text-[var(--color-text-secondary)]">
                  <p>
                    Client:{" "}
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {task.client_email}
                    </span>
                  </p>
                  <p>
                    Budget:{" "}
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      ${task.budget}
                    </span>
                  </p>
                  <p>
                    Deadline:{" "}
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </p>
                </div>

                {task.status === "Completed" && task.deliverable_url && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                      Submitted Deliverable:
                    </p>
                    <a
                      href={task.deliverable_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {task.deliverable_url}
                    </a>
                  </div>
                )}
              </div>

              {task.status === "In Progress" && (
                <button
                  onClick={() => submitDeliverable(task._id)}
                  className="mt-4 w-full bg-[var(--color-text-primary)] text-white py-2.5 rounded-lg font-bold hover:bg-opacity-90 transition-colors"
                >
                  Submit Deliverable
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
