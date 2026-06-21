"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function BrowseTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // State models for search and filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 9; // Enforced limit of 9

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
    <main className="min-h-screen bg-[#F9F6F0] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#2C1A0E] mb-8">Browse Tasks</h1>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-xl border border-[rgba(44,26,14,0.1)] shadow-sm">
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#C8845A]"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#C8845A] bg-white min-w-[200px]"
          >
            <option value="All">All Categories</option>
            <option value="Design">Design</option>
            <option value="Writing">Writing</option>
            <option value="Development">Development</option>
            <option value="Marketing">Marketing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">
            Loading tasks...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="border border-[rgba(44,26,14,0.1)] rounded-2xl p-6 bg-white hover:shadow-lg transition-all flex flex-col"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#2C1A0E] mb-2">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 truncate">
                      Client: {task.client_email}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-[#F5E6D3] text-[#C8845A] px-3 py-1 rounded-full text-xs font-semibold">
                        {task.category}
                      </span>
                      <span className="font-bold text-[#2C1A0E]">
                        ${task.budget}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                      Due: {new Date(task.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/tasks/${task._id}`}
                    className="block text-center w-full bg-[#C8845A] text-white py-2.5 rounded-lg font-bold hover:bg-opacity-90 transition-colors mt-auto"
                  >
                    View Task
                  </Link>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="col-span-3 text-center text-gray-500 py-12">
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
                  className="px-4 py-2 border border-[#C8845A] text-[#C8845A] rounded-lg disabled:opacity-50 font-medium hover:bg-[#F5E6D3] transition-colors"
                >
                  Previous
                </button>
                <span className="text-[#2C1A0E] font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-[#C8845A] text-[#C8845A] rounded-lg disabled:opacity-50 font-medium hover:bg-[#F5E6D3] transition-colors"
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
