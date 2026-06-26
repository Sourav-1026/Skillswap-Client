"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@heroui/react";

export default function EarningsPage() {
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
        fetchCompletedTasks(session.user.email);
      }
    }
  }, [session, isPending, router]);

  const fetchCompletedTasks = async (email) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/freelancer/${email}`,
        {
          credentials: "include",
        },
      );
      if (res.ok) {
        const data = await res.json();
        // Filter only completed tasks for earnings
        setTasks(data.filter((t) => t.status === "Completed"));
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

  const totalEarnings = tasks.reduce((acc, t) => acc + Number(t.budget), 0);

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          href="/dashboard/freelancer"
          className="text-[var(--color-accent)] hover:underline mb-4 inline-block font-medium"
        >
          &larr; Back to Dashboard
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              My Earnings
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Breakdown of payments from completed tasks.
            </p>
          </div>
          <div className="bg-green-100 text-green-800 px-6 py-3 rounded-xl border border-green-200 text-right">
            <p className="text-sm font-semibold uppercase tracking-wider mb-1 text-green-700">
              Total Made
            </p>
            <p className="text-3xl font-bold">${totalEarnings}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
              <th className="p-4 font-medium">Task Title</th>
              <th className="p-4 font-medium">Client Name</th>
              <th className="p-4 font-medium">Amount Made</th>
              <th className="p-4 font-medium">Deadline / Completion Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="p-8 text-center text-gray-500 italic"
                >
                  No earnings history found.
                </td>
              </tr>
            ) : (
              tasks.map((t) => (
                <tr
                  key={t._id}
                  className="hover:bg-[var(--color-surface-raised)] transition-colors text-[var(--color-text-primary)] border-b border-[var(--color-border)] last:border-b-0"
                >
                  <td className="p-4 font-medium">{t.title}</td>
                  <td className="p-4">{t.client_email}</td>
                  <td className="p-4 font-bold text-green-700">+${t.budget}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(t.deadline).toLocaleDateString()}
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
