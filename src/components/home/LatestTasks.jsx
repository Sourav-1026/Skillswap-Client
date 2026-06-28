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
    <section className="py-20 px-6 w-full max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12 text-primary">
        Latest Featured Tasks
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="border border-border rounded-2xl p-6 hover:border-accent transition-all duration-300 bg-surface flex flex-col h-full"
          >
            <div className="flex-1">
              <h3 className="text-xl font-bold text-primary mb-2">
                {task.title}
              </h3>
              <p className="text-sm text-secondary mb-4 truncate">
                Client: {task.client_email}
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="bg-background text-accent border border-border px-3 py-1 rounded-full text-xs font-semibold">
                  {task.category}
                </span>
                <span className="font-bold text-primary">${task.budget}</span>
              </div>
              <p className="text-sm text-secondary mb-6">
                Due: {new Date(task.deadline).toLocaleDateString()}
              </p>
            </div>
            <Link
              href={`/tasks/${task._id}`}
              className="block text-center w-full bg-accent text-accent-text py-2.5 rounded-lg font-medium hover:bg-accent-hover transition-colors mt-auto"
            >
              View Task
            </Link>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="col-span-3 text-center text-secondary">
            No open tasks available.
          </div>
        )}
      </div>
    </section>
  );
}
