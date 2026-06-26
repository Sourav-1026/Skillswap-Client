"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { FiUsers, FiFileText, FiDollarSign, FiActivity } from "react-icons/fi";
import { Spinner } from "@heroui/react";

export default function AdminDashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && session?.user?.role === "admin") {
      fetchStats();
    }
  }, [session, isPending]);

  const fetchStats = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/stats`,
        {
          credentials: "include",
        },
      );
      if (res.ok) {
        setStats(await res.json());
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
  if (!stats)
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load statistics.
      </div>
    );

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: FiUsers,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: FiFileText,
      color: "text-purple-500",
      bg: "bg-purple-100",
    },
    {
      title: "Active Tasks",
      value: stats.activeTasks,
      icon: FiActivity,
      color: "text-green-500",
      bg: "bg-green-100",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: FiDollarSign,
      color: "text-[#C8845A]",
      bg: "bg-[#F5E6D3]",
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[#2C1A0E] mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 shadow-sm border border-[rgba(44,26,14,0.1)] flex items-center gap-6 hover:shadow-md transition-shadow"
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${card.bg} ${card.color}`}
            >
              <card.icon />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                {card.title}
              </p>
              <h2 className="text-3xl font-bold text-[#2C1A0E]">
                {card.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm border border-[rgba(44,26,14,0.1)]">
        <h2 className="text-2xl font-bold text-[#2C1A0E] mb-4">
          Welcome, Admin!
        </h2>
        <p className="text-gray-600">
          Use the sidebar navigation to manage users, moderate tasks, and view
          platform transactions. SkillSwap is currently tracking{" "}
          <strong>{stats.totalTasks}</strong> tasks across{" "}
          <strong>{stats.totalUsers}</strong> users.
        </p>
      </div>
    </div>
  );
}
