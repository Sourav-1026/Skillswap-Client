"use client";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function LeaveReview({ taskId, taskOwnerEmail }) {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(true);
  const [freelancerEmail, setFreelancerEmail] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user?.email === taskOwnerEmail) {
      checkReviewStatus();
    } else {
      setLoading(false);
    }
  }, [session, taskOwnerEmail]);

  const checkReviewStatus = async () => {
    try {
      // 1. Get accepted proposal to find freelancer email
      const propRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/proposals?taskId=${taskId}`,
        { credentials: "include" },
      );
      if (propRes.ok) {
        const proposals = await propRes.json();
        const accepted = proposals.find((p) => p.status === "accepted");
        if (accepted) {
          setFreelancerEmail(accepted.freelancer_email);

          // 2. Check if a review already exists
          const revRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/reviews?taskId=${taskId}`,
            { credentials: "include" },
          );
          if (revRes.ok) {
            const reviews = await revRes.json();
            if (reviews.length > 0) {
              setHasReviewed(true);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (
    loading ||
    !session ||
    session.user.email !== taskOwnerEmail ||
    !freelancerEmail
  ) {
    return null;
  }

  if (hasReviewed) {
    return (
      <div className="mt-8 p-6 bg-green-50 border border-green-100 rounded-2xl text-center">
        <p className="text-green-800 font-semibold">
          You have already reviewed the freelancer for this task.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            task_id: taskId,
            reviewee_email: freelancerEmail,
            rating: Number(rating),
            comment,
          }),
        },
      );

      if (res.ok) {
        toast.success("Review submitted successfully!");
        setHasReviewed(true);
      } else {
        toast.error("Failed to submit review");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
      <h3 className="text-xl font-bold text-[#2C1A0E] mb-4">Leave a Review</h3>
      <p className="text-sm text-gray-500 mb-6">
        Rate {freelancerEmail}'s work on this task.
      </p>

      <form onSubmit={handleSubmit} className="bg-[#F9F6F0] p-6 rounded-2xl">
        <div className="mb-4">
          <label className="block text-sm font-bold text-[#2C1A0E] mb-2">
            Rating (1-5)
          </label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full md:w-32 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#C8845A]"
          >
            {[5, 4, 3, 2, 1].map((num) => (
              <option key={num} value={num}>
                {num} Stars
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-[#2C1A0E] mb-2">
            Comment
          </label>
          <textarea
            required
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was your experience?"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#C8845A]"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#2C1A0E] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-opacity-90 transition-colors disabled:opacity-70"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
