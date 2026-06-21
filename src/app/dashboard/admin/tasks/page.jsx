"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

export default function AdminTasksPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/signin");
      } else if (session.user.role !== "admin") {
        router.push(`/dashboard/${session.user.role}`);
      } else {
        fetchTasks();
      }
    }
  }, [session, isPending, router]);

  const fetchTasks = async () => {
    try {
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

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to forcibly delete this task?")) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          },
        );
        if (res.ok) {
          toast.success("Task deleted successfully");
          fetchTasks();
        } else {
          toast.error("Failed to delete task");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (isPending || loading)
    return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/admin"
            className="text-[var(--color-accent)] hover:underline mb-2 inline-block font-medium text-sm"
          >
            &larr; Back to Admin Users
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Manage Platform Tasks
          </h1>
        </div>
      </div>

      <div className="overflow-x-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No tasks found.
                </td>
              </tr>
            ) : (
              tasks.map((t) => (
                <tr
                  key={t._id}
                  className="hover:bg-[var(--color-surface-raised)] transition-colors text-[var(--color-text-primary)] border-b border-[var(--color-border)] last:border-b-0"
                >
                  <td className="p-4 font-medium">
                    <Link href={`/tasks/${t._id}`} className="hover:underline">
                      {t.title}
                    </Link>
                  </td>
                  <td className="p-4 text-sm">{t.client_email}</td>
                  <td className="p-4 capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        t.status === "open"
                          ? "bg-green-100 text-green-700"
                          : t.status === "Completed"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    {new Date(t.createdAt || t.deadline).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="text-sm font-semibold text-red-600 hover:underline"
                    >
                      Force Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
