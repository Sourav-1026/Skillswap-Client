"use client";

import React, { useState, useMemo } from "react";
import { FiEye, FiEdit2, FiTrash2, FiClipboard } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const STATUS_COLORS = {
  Open: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  "In Progress": {
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    dot: "bg-blue-500",
  },
  Completed: {
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  Cancelled: { bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500" },
};

const CATEGORY_LABELS = {
  "web-dev": "Web Development",
  "mobile-dev": "Mobile Development",
  "ui-ux": "UI/UX Design",
  "graphic-design": "Graphic Design",
  "content-writing": "Content Writing",
  seo: "SEO & Marketing",
  "data-entry": "Data Entry",
  "video-editing": "Video Editing",
  other: "Other",
};

const ClientTasksTable = ({ tasks = [] }) => {
  const router = useRouter();
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "title",
    direction: "ascending",
  });

  const sorted = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const av = a[sortDescriptor.column] ?? "";
      const bv = b[sortDescriptor.column] ?? "";
      const cmp = av.toString().localeCompare(bv.toString());
      return sortDescriptor.direction === "ascending" ? cmp : -cmp;
    });
  }, [tasks, sortDescriptor]);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          },
        );
        if (res.ok) {
          toast.success("Task deleted successfully!");
          router.refresh();
        } else {
          toast.error("Failed to delete task.");
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred.");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <FiClipboard className="text-[var(--color-accent)]" size={24} />
            <h1
              className="text-2xl font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              My Tasks
            </h1>
          </div>
          <p
            className="text-sm ml-8"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Manage and track all your posted tasks in one place
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {["Open", "In Progress", "Completed", "Cancelled"].map((s) => {
            const count = tasks.filter(
              (t) => (t.status || "Open").toLowerCase() === s.toLowerCase(),
            ).length;
            const c = STATUS_COLORS[s];
            return (
              <div
                key={s}
                className="rounded-xl border border-border p-5 transition-shadow hover:shadow-md"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {s}
                </p>
                <p className={`text-3xl font-bold ${c.text}`}>{count}</p>
              </div>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sorted.map((task) => {
            let statusKey = "Open";
            if (task.status === "In Progress") statusKey = "In Progress";
            if (task.status === "Completed") statusKey = "Completed";
            if (task.status === "Cancelled") statusKey = "Cancelled";

            const sc = STATUS_COLORS[statusKey];

            return (
              <div
                key={task._id}
                className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border)] shadow-sm flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4 gap-4">
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] line-clamp-2">
                    {task.title}
                  </h3>
                  <span
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${sc.bg} ${sc.text}`}
                  >
                    {statusKey}
                  </span>
                </div>

                <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                  Budget: ${task.budget || task.proposed_budget || "N/A"} |
                  Category: {CATEGORY_LABELS[task.category] ?? task.category}
                </p>

                <div className="mt-auto pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                  <Link
                    href={`/tasks/${task._id}`}
                    className="text-[var(--color-accent)] hover:underline text-sm font-medium flex items-center gap-1"
                  >
                    <FiEye size={16} /> <span>View Details &rarr;</span>
                  </Link>
                  {statusKey === "Open" && (
                    <div className="flex gap-4">
                      <Link
                        href={`/dashboard/client/edit-task/${task._id}`}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                      >
                        <FiEdit2 size={14} /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-sm font-semibold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
                      >
                        <FiTrash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="py-20 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiClipboard className="text-gray-400" size={28} />
            </div>
            <p className="text-lg font-medium text-[var(--color-text-primary)] mb-1">
              No tasks found
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              You haven't posted any tasks yet.
            </p>
            <Link
              href="/dashboard/client/post-task"
              className="mt-4 inline-block bg-[var(--color-accent)] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Post a Task
            </Link>
          </div>
        )}

        <p
          className="text-sm text-center mt-6"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Showing {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default ClientTasksTable;
