"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ total, limit, currentPage }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    router.push(`/tasks?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 border border-gray-300 bg-white text-[#2C1A0E] rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
      >
        Previous
      </button>
      <span className="text-[#2C1A0E] font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 border border-gray-300 bg-white text-[#2C1A0E] rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
      >
        Next
      </button>
    </div>
  );
}
