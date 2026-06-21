"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { FiDollarSign } from "react-icons/fi";

export default function FreelancerEarningsPage() {
  const { data: session, isPending } = authClient.useSession();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && session?.user?.role === "freelancer") {
      fetchPayments(session.user.email);
    }
  }, [session, isPending]);

  const fetchPayments = async (email) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments?freelancerEmail=${email}`,
        {
          credentials: "include",
        },
      );
      if (res.ok) {
        setPayments(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isPending || loading)
    return <div className="p-10 text-center">Loading earnings...</div>;

  const totalEarnings = payments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[#2C1A0E] mb-8">My Earnings</h1>

      <div className="bg-gradient-to-br from-[#2C1A0E] to-[#4A2C18] rounded-3xl p-8 mb-8 text-white shadow-md flex items-center justify-between">
        <div>
          <p className="text-[#F5E6D3] opacity-80 mb-1 font-medium">
            Total Lifetime Earnings
          </p>
          <h2 className="text-5xl font-bold">
            ${totalEarnings.toLocaleString()}
          </h2>
        </div>
        <div className="w-16 h-16 bg-[#C8845A] rounded-full flex items-center justify-center text-3xl">
          <FiDollarSign />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[rgba(44,26,14,0.1)] overflow-hidden">
        <h3 className="text-xl font-bold text-[#2C1A0E] p-6 border-b border-[rgba(44,26,14,0.1)]">
          Payment History
        </h3>
        {payments.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No payments received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9F6F0] border-b border-[rgba(44,26,14,0.1)]">
                  <th className="p-4 font-semibold text-[#2C1A0E]">Date</th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">Task ID</th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">Client</th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">Amount</th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="border-b border-[rgba(44,26,14,0.05)] hover:bg-[#F9F6F0] transition-colors"
                  >
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(payment.paid_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm font-mono text-gray-600 truncate max-w-[120px]">
                      {payment.task_id}
                    </td>
                    <td className="p-4 text-[#2C1A0E] truncate max-w-[150px]">
                      {payment.client_email}
                    </td>
                    <td className="p-4 font-bold text-[#2C1A0E]">
                      ${payment.amount}
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700">
                        {payment.payment_status}
                      </span>
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
