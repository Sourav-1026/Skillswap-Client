import React from "react";
import Link from "next/link";

export default async function LatestTasks() {
  let tasks = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks?limit=3`,
      { cache: "no-store" },
    );
    if (res.ok) {
      const data = await res.json();
      tasks = data.tasks || [];
    }
  } catch (error) {
    console.error("Failed to fetch latest tasks:", error);
  }

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12 text-[#2C1A0E]">
        Latest Featured Tasks
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="border border-[rgba(44,26,14,0.1)] rounded-2xl p-6 hover:shadow-lg transition-all duration-300 bg-white flex flex-col h-full"
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
                <span className="font-bold text-[#2C1A0E]">${task.budget}</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Due: {new Date(task.deadline).toLocaleDateString()}
              </p>
            </div>
            <Link
              href={`/tasks/${task._id}`}
              className="block text-center w-full bg-[#C8845A] text-[#2C1A0E] py-2.5 rounded-lg font-medium hover:bg-[#b0724b] transition-colors mt-auto"
            >
              View Task
            </Link>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="col-span-3 text-center text-gray-500">
            No open tasks available.
          </div>
        )}
      </div>
    </section>
  );
}
