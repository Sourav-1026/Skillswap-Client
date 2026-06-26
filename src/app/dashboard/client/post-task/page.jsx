"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "react-toastify";
import { Spinner } from "@heroui/react";
import { authFetch } from "@/lib/api";

export default function PostTaskPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/signin");
      } else if (session.user.role !== "client") {
        router.push(`/dashboard/${session.user.role}`);
      }
    }
  }, [session, isPending, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const taskData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      budget: Number(formData.get("budget")),
      deadline: formData.get("deadline"),
    };

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`,
        {
          method: "POST",
          body: JSON.stringify(taskData),
        },
      );

      if (res.ok) {
        toast.success("Task posted successfully!");
        router.push("/dashboard/client");
      } else {
        const errorData = await res.json();
        toast.error(
          `Failed to post task: ${errorData.message || res.statusText}`,
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while posting the task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="text-accent" size="lg" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F9F6F0] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/dashboard/client"
          className="text-[#C8845A] hover:underline mb-8 inline-block font-medium"
        >
          &larr; Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl p-8 border border-[rgba(44,26,14,0.1)] shadow-sm">
          <h1 className="text-3xl font-bold text-[#2C1A0E] mb-2">
            Post a New Task
          </h1>
          <p className="text-gray-500 mb-8">
            Fill out the details below to find the perfect freelancer for your
            project.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-[#2C1A0E] mb-2">
                Task Title
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Build a React e-commerce website"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#C8845A] focus:outline-none focus:ring-1 focus:ring-[#C8845A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C1A0E] mb-2">
                Description
              </label>
              <textarea
                name="description"
                required
                rows={5}
                placeholder="Provide a detailed description of what you need..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#C8845A] focus:outline-none focus:ring-1 focus:ring-[#C8845A] transition-colors resize-y"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#2C1A0E] mb-2">
                  Category
                </label>
                <select
                  name="category"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#C8845A] focus:outline-none focus:ring-1 focus:ring-[#C8845A] transition-colors bg-white"
                >
                  <option value="">Select a category</option>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Writing">Writing</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Video">Video</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C1A0E] mb-2">
                  Budget (USD)
                </label>
                <input
                  type="number"
                  name="budget"
                  required
                  min="5"
                  placeholder="e.g. 500"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#C8845A] focus:outline-none focus:ring-1 focus:ring-[#C8845A] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C1A0E] mb-2">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#C8845A] focus:outline-none focus:ring-1 focus:ring-[#C8845A] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full bg-[#C8845A] text-white py-3 rounded-lg font-bold hover:bg-[#b0724b] transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Posting..." : "Post Task"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
