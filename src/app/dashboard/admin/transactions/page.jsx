"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Spinner } from "@heroui/react";
import { authFetch } from "@/lib/api";

export default function TransactionsHistoryPage() {
  const { data: session, isPending } = authClient.useSession();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && session?.user?.role === "admin") {
      fetchTransactions();
    }
  }, [session, isPending]);

  const fetchTransactions = async () => {
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments`,
      );
      if (res.ok) {
        setTransactions(await res.json());
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

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[#2C1A0E] mb-8">
        Transactions History
      </h1>

      <div className="bg-white rounded-3xl shadow-sm border border-[rgba(44,26,14,0.1)] overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9F6F0] border-b border-[rgba(44,26,14,0.1)]">
                  <th className="p-4 font-semibold text-[#2C1A0E]">
                    Client Email
                  </th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">
                    Freelancer Email
                  </th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">
                    Payout Size
                  </th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">
                    Payment Date
                  </th>
                  <th className="p-4 font-semibold text-[#2C1A0E]">
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="border-b border-[rgba(44,26,14,0.05)] hover:bg-[#F9F6F0] transition-colors"
                  >
                    <td className="p-4 text-sm text-[#2C1A0E] font-medium">
                      {tx.client_email}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <Link
                        href={`/freelancers/${tx.freelancer_email}`}
                        className="hover:underline text-[#C8845A]"
                      >
                        {tx.freelancer_email}
                      </Link>
                    </td>
                    <td className="p-4 font-bold text-[#2C1A0E]">
                      ${tx.amount}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(tx.paid_at).toLocaleDateString()}{" "}
                      {new Date(tx.paid_at).toLocaleTimeString()}
                    </td>
                    <td className="p-4 text-sm font-mono text-gray-400">
                      {tx.transaction_id}
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
