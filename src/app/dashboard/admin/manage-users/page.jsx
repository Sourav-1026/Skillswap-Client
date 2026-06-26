"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { Spinner } from "@heroui/react";

export default function ManageUsersPage() {
  const { data: session, isPending } = authClient.useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && session?.user?.role === "admin") {
      fetchUsers();
    }
  }, [session, isPending]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
        credentials: "include",
      });
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (email, currentStatus) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${email}/block`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ isBlocked: !currentStatus }),
        },
      );
      if (res.ok) {
        toast.success(
          `User ${!currentStatus ? "blocked" : "unblocked"} successfully.`,
        );
        fetchUsers();
      } else {
        toast.error("Failed to update user status.");
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
      <h1 className="text-3xl font-bold text-[#2C1A0E] mb-8">Manage Users</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-[rgba(44,26,14,0.1)] overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9F6F0] border-b border-[rgba(44,26,14,0.1)]">
                  <th className="p-4 font-semibold text-[#2C1A0E]">Name</th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">Email</th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">Role</th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">Status</th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id || u.email}
                    className="border-b border-[rgba(44,26,14,0.05)] hover:bg-[#F9F6F0] transition-colors"
                  >
                    <td className="p-4 font-bold text-[#2C1A0E]">{u.name}</td>
                    <td className="p-4 text-sm text-gray-600">{u.email}</td>
                    <td className="p-4">
                      <span className="bg-[#F5E6D3] text-[#C8845A] px-3 py-1 rounded-full text-xs font-bold uppercase">
                        {u.role || "user"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${u.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                      >
                        {u.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => handleBlockUser(u.email, u.isBlocked)}
                          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                            u.isBlocked
                              ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                        >
                          {u.isBlocked ? "Unblock" : "Block"}
                        </button>
                      )}
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
