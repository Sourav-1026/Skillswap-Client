"use client";
import React, { useEffect, useState } from "react";
import {
  MdOutlineList,
  MdOutlineRadioButtonUnchecked,
  MdOutlineLoop,
  MdOutlineAttachMoney,
} from "react-icons/md";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@heroui/react";

const ClientPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/signin");
      } else if (session.user.role !== "client") {
        router.push(`/dashboard/${session.user.role}`);
      } else {
        fetchTasks(session.user.email);
      }
    }
  }, [session, isPending, router]);

  const fetchTasks = async (email) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks?clientEmail=${email}`,
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

  if (isPending || loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="text-accent" size="lg" />
      </div>
    );

  const totalSpent = tasks.reduce(
    (acc, t) => (t.status !== "open" ? acc + Number(t.budget) : acc),
    0,
  );

  const stats = [
    {
      label: "Total Tasks",
      value: tasks.length,
      icon: <MdOutlineList size={20} />,
    },
    {
      label: "Open Tasks",
      value: tasks.filter((t) => t.status === "open").length,
      icon: <MdOutlineRadioButtonUnchecked size={20} />,
    },
    {
      label: "Tasks In Progress",
      value: tasks.filter((t) => t.status === "In Progress").length,
      icon: <MdOutlineLoop size={20} />,
    },
    {
      label: "Total Spent (USD)",
      value: `$${totalSpent}`,
      icon: <MdOutlineAttachMoney size={20} />,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          Client Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              padding: "1.25rem",
            }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "13px",
                }}
              >
                {stat.label}
              </span>
              <span
                style={{
                  background: "rgba(200,132,90,0.15)",
                  borderRadius: "8px",
                  padding: "6px",
                  color: "var(--color-accent)",
                  display: "flex",
                }}
              >
                {stat.icon}
              </span>
            </div>
            <span
              style={{
                color: "var(--color-text-primary)",
                fontSize: "28px",
                fontWeight: 500,
              }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-(--color-text-primary) mb-4">
        My Posted Tasks
      </h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">You haven't posted any tasks yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border)] shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                  {task.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${task.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                >
                  {task.status}
                </span>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Budget: ${task.budget} | Category: {task.category}
              </p>
              <div className="flex justify-between items-center mt-4">
                <Link
                  href={`/tasks/${task._id}`}
                  className="text-[var(--color-accent)] hover:underline text-sm font-medium"
                >
                  View Proposals &rarr;
                </Link>
                {task.status === "open" && (
                  <div className="flex gap-3">
                    <Link
                      href={`/dashboard/client/edit-task/${task._id}`}
                      className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={async () => {
                        if (
                          confirm("Are you sure you want to delete this task?")
                        ) {
                          const res = await fetch(
                            `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${task._id}`,
                            { method: "DELETE", credentials: "include" },
                          );
                          if (res.ok) {
                            fetchTasks(session.user.email);
                          }
                        }
                      }}
                      className="text-sm font-semibold text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientPage;
