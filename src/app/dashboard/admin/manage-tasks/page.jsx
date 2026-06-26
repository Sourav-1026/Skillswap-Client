"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Link from "next/link";
import { Spinner } from "@heroui/react";

export default function ManageTasksPage() {
  const { data: session, isPending } = authClient.useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && session?.user?.role === "admin") {
      fetchTasks();
    }
  }, [session, isPending]);

  const fetchTasks = async () => {
    try {
      // Fetch all tasks without limit/page for admin view
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks?limit=100`,
        {
          credentials: "include",
        },
      );
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this task? This action cannot be undone.",
      )
    )
      return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${taskId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (res.ok) {
        toast.success("Task deleted successfully.");
        fetchTasks();
      } else {
        toast.error("Failed to delete task.");
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
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[#2C1A0E] mb-8">Manage Tasks</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-[rgba(44,26,14,0.1)] overflow-hidden">
        {tasks.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No tasks found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9F6F0] border-b border-[rgba(44,26,14,0.1)]">
                  <th className="p-4 font-semibold text-[#2C1A0E]">Title</th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">
                    Client Email
                  </th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">Status</th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">Created</th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr
                    key={t._id}
                    className="border-b border-[rgba(44,26,14,0.05)] hover:bg-[#F9F6F0] transition-colors"
                  >
                    <td
                      className="p-4 font-bold text-[#2C1A0E] max-w-[200px] truncate"
                      title={t.title}
                    >
                      {t.title}
                    </td>
                    <td className="p-4 text-sm text-gray-600 truncate max-w-[150px]">
                      {t.client_email}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          t.status === "open"
                            ? "bg-green-100 text-green-700"
                            : t.status === "In Progress"
                              ? "bg-blue-100 text-blue-700"
                              : t.status === "Completed"
                                ? "bg-gray-200 text-gray-800"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 flex gap-3 items-center">
                      <Link
                        href={`/tasks/${t._id}`}
                        className="text-[#C8845A] font-medium hover:underline text-sm"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteTask(t._id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                      >
                        Delete
                      </button>
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
}
