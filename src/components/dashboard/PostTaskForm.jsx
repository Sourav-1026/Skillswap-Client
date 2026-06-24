"use client";

import { createPost } from "@/lib/actions/tasks";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React from "react";
import {
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Button,
  TextArea,
} from "react-aria-components";
import {
  FiFileText,
  FiTag,
  FiAlignLeft,
  FiDollarSign,
  FiCalendar,
  FiSend,
} from "react-icons/fi";
import { toast } from "react-toastify";

const CATEGORIES = [
  { id: "web-dev", label: "Web Development" },
  { id: "mobile-dev", label: "Mobile Development" },
  { id: "ui-ux", label: "UI/UX Design" },
  { id: "graphic-design", label: "Graphic Design" },
  { id: "content-writing", label: "Content Writing" },
  { id: "seo", label: "SEO & Marketing" },
  { id: "data-entry", label: "Data Entry" },
  { id: "video-editing", label: "Video Editing" },
  { id: "other", label: "Other" },
];

const fieldClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition";

const labelClass =
  "flex items-center gap-1.5 text-sm font-medium text-primary mb-1.5";

const PostTaskForm = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  console.log(user);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const newData = {
      ...data,
      status: "open",
      budget: Number(data.budget),
      clientId: user?.id,
      clientName: user?.name,
      clientEmail: user?.email,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newData),
        },
      );

      if (response.ok) {
        toast.success("Task posted successfully!");
        router.push("/dashboard/client");
      } else {
        const err = await response.json();
        toast.error(
          `Failed to post task: ${err.message || response.statusText}`,
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while posting the task");
    }
  };

  return (
    <div className="min-h-screen bg-[#2C1A0E] flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#F5E6D3]">Post a New Task</h1>
          <p className="text-sm text-secondary mt-1">
            Fill in the details below to find the right freelancer for your
            project.
          </p>
        </div>

        <Form
          onSubmit={onSubmit}
          className="rounded-xl border border-[rgba(255,220,180,0.12)] bg-surface p-6 space-y-5 shadow-sm"
        >
          {/* Task Title */}
          <TextField name="title" isRequired className="w-full">
            <Label className={labelClass}>
              <FiFileText className="text-[#C8845A]" size={14} />
              Task Title
            </Label>
            <Input
              className={fieldClass}
              placeholder="e.g. Build a landing page in Next.js"
            />
            <FieldError className="text-xs text-red-400 mt-1" />
          </TextField>

          {/* Category */}
          <div className="w-full">
            <label className={labelClass}>
              <FiTag className="text-[#C8845A]" size={14} />
              Category
            </label>
            <select
              name="category"
              required
              defaultValue=""
              className={fieldClass}
            >
              <option value="" disabled className="bg-surface text-muted">
                Select a category
              </option>
              {CATEGORIES.map((cat) => (
                <option
                  key={cat.id}
                  value={cat.id}
                  className="bg-surface text-[#F5E6D3]"
                >
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="w-full">
            <label className={labelClass}>
              <FiAlignLeft className="text-[#C8845A]" size={14} />
              Description
            </label>
            <TextArea
              name="description"
              aria-label="Task description"
              className={`${fieldClass} h-32 resize-none`}
              placeholder="Describe what you need done — requirements, deliverables, and any relevant context…"
            />
          </div>

          {/* Budget + Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              name="budget"
              type="number"
              isRequired
              className="w-full"
            >
              <Label className={labelClass}>
                <FiDollarSign className="text-[#C8845A]" size={14} />
                Budget (USD)
              </Label>
              <Input className={fieldClass} placeholder="e.g. 250" min={1} />
              <FieldError className="text-xs text-red-400 mt-1" />
            </TextField>

            <TextField
              name="deadline"
              type="date"
              isRequired
              className="w-full"
            >
              <Label className={labelClass}>
                <FiCalendar className="text-[#C8845A]" size={14} />
                Deadline Date
              </Label>
              <Input className={`${fieldClass} scheme-dark`} />
              <FieldError className="text-xs text-red-400 mt-1" />
            </TextField>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-full bg-[#C8845A] text-[#2C1A0E] text-sm font-semibold py-2.5 hover:bg-accent-hover active:scale-[0.98] transition cursor-pointer mt-2"
          >
            <FiSend size={15} />
            Post Task
          </Button>
        </Form>

        <p className="text-center text-xs text-muted mt-4">
          Your task will be visible to verified freelancers only.
        </p>
      </div>
    </div>
  );
};

export default PostTaskForm;
