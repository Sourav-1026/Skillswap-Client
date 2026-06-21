"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Link from "next/link";

export default function FreelancerProjectPage() {
  const { data: session, isPending } = authClient.useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliverables, setDeliverables] = useState({});

  useEffect(() => {
    if (!isPending && session?.user?.role === "freelancer") {
      fetchProjects(session.user.email);
    }
  }, [session, isPending]);

  const fetchProjects = async (email) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/freelancer/${email}`,
        {
          credentials: "include",
        },
      );
      if (res.ok) {
        setProjects(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverableChange = (taskId, value) => {
    setDeliverables((prev) => ({ ...prev, [taskId]: value }));
  };

  const submitDeliverable = async (taskId) => {
    const url = deliverables[taskId];
    if (!url) return toast.error("Please enter a deliverable URL");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: "Completed", deliverable_url: url }),
        },
      );
      if (res.ok) {
        toast.success("Deliverable submitted! Task marked as completed.");
        fetchProjects(session.user.email);
      } else {
        toast.error("Failed to submit deliverable");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  if (isPending || loading)
    return <div className="p-10 text-center">Loading projects...</div>;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[#2C1A0E] mb-8">My Projects</h1>

      {projects.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[rgba(44,26,14,0.1)] shadow-sm">
          <p className="text-gray-500 mb-4">You have no active projects yet.</p>
          <Link
            href="/tasks"
            className="text-[#C8845A] font-semibold hover:underline"
          >
            Browse open tasks and submit proposals &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(44,26,14,0.1)] flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <h3
                  className="text-xl font-bold text-[#2C1A0E] truncate mr-4"
                  title={project.title}
                >
                  {project.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap ${
                    project.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : project.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-6 flex-1 space-y-2">
                <p>
                  <strong>Client:</strong> {project.client_email}
                </p>
                <p>
                  <strong>Budget:</strong> ${project.budget}
                </p>
                <p>
                  <strong>Deadline:</strong>{" "}
                  {new Date(project.deadline).toLocaleDateString()}
                </p>
                {project.deliverable_url && (
                  <p>
                    <strong>Deliverable:</strong>{" "}
                    <a
                      href={project.deliverable_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#C8845A] underline truncate"
                    >
                      {project.deliverable_url}
                    </a>
                  </p>
                )}
              </div>

              {project.status === "In Progress" && (
                <div className="mt-auto pt-4 border-t border-[rgba(44,26,14,0.1)]">
                  <label className="block text-sm font-semibold text-[#2C1A0E] mb-2">
                    Submit Deliverable Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={deliverables[project._id] || ""}
                      onChange={(e) =>
                        handleDeliverableChange(project._id, e.target.value)
                      }
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C8845A]"
                    />
                    <button
                      onClick={() => submitDeliverable(project._id)}
                      className="bg-[#2C1A0E] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1a0f08] transition-colors whitespace-nowrap"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
