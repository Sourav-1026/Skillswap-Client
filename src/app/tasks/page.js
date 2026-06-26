"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Spinner } from "@heroui/react";

function TasksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // State models for search and filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All",
  );
  const [page, setPage] = useState(1);
  const limit = 9; // Enforced limit of 9

  useEffect(() => {
    // Update URL when filters change
    const params = new URLSearchParams(searchParams.toString());
    if (category && category !== "All") params.set("category", category);
    else params.delete("category");

    if (search) params.set("search", search);
    else params.delete("search");

    router.replace(`/tasks?${params.toString()}`, { scroll: false });
  }, [category, search]);

  useEffect(() => {
    // Reset to page 1 when search or category changes
    setPage(1);
  }, [search, category]);

  useEffect(() => {
    fetchTasks();
  }, [search, category, page]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status: "open",
      });
      if (search) queryParams.set("search", search);
      if (category && category !== "All") queryParams.set("category", category);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks?${queryParams.toString()}`,
      );
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8">Browse Tasks</h1>

        {/* Filters and Search */}
        <div className="flex flex-col gap-6 mb-8 bg-surface-raised p-6 md:p-8 rounded-2xl border border-border shadow-md">
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border px-5 py-3.5 bg-surface text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all"
          />
          <div className="flex flex-wrap gap-3">
            {[
              "All",
              "Design",
              "Writing",
              "Development",
              "Marketing",
              "Other",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 border-2 ${
                  category === cat
                    ? "bg-surface text-accent border-accent shadow-[0_0_15px_rgba(200,132,90,0.3)]"
                    : "bg-surface text-primary border-transparent hover:border-accent hover:text-accent"
                }`}
              >
                {cat === "All" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Spinner className="text-accent" size="lg" />
          </div>
        ) : (
          <>
            {/* Task list maps through the available tasks and renders them as cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="border border-border rounded-2xl p-6 bg-surface hover:border-accent transition-all flex flex-col"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {task.title}
                    </h3>
                    <p className="text-sm text-secondary mb-4 truncate">
                      Client: {task.client_email}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-background border border-border text-accent px-3 py-1 rounded-full text-xs font-semibold">
                        {task.category}
                      </span>
                      <span className="font-bold text-primary">
                        ${task.budget}
                      </span>
                    </div>
                    <p className="text-sm text-secondary mb-6">
                      Due: {new Date(task.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/tasks/${task._id}`}
                    className="block text-center w-full bg-accent text-accent-text py-2.5 rounded-lg font-bold hover:bg-accent-hover transition-colors mt-auto"
                  >
                    View Task
                  </Link>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="col-span-3 text-center text-secondary py-12">
                  No tasks found matching your filters.
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-accent text-accent rounded-lg disabled:opacity-50 font-medium hover:bg-surface-raised transition-colors"
                >
                  Previous
                </button>
                <span className="text-primary font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-accent text-accent rounded-lg disabled:opacity-50 font-medium hover:bg-surface-raised transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function BrowseTasksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Spinner className="text-accent" size="lg" />
        </div>
      }
    >
      <TasksContent />
    </Suspense>
  );
}
