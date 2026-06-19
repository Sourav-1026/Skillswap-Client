"use client";

import React, { useState, useMemo } from "react";
import { Button, Table } from "@heroui/react";
import { FiEye, FiEdit2, FiTrash2, FiClipboard } from "react-icons/fi";

const STATUS_COLORS = {
  Open: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  "In Progress": {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  Completed: {
    bg: "bg-[#C8845A]/10",
    text: "text-[#C8845A]",
    dot: "bg-[#C8845A]",
  },
  Cancelled: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
};

const CATEGORY_LABELS = {
  "web-dev": "Web Development",
  "mobile-dev": "Mobile Development",
  "ui-ux": "UI/UX Design",
  "graphic-design": "Graphic Design",
  "content-writing": "Content Writing",
  seo: "SEO & Marketing",
  "data-entry": "Data Entry",
  "video-editing": "Video Editing",
  other: "Other",
};

const ClientTasksTable = ({ tasks = [] }) => {
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "title",
    direction: "ascending",
  });

  const sorted = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const av = a[sortDescriptor.column] ?? "";
      const bv = b[sortDescriptor.column] ?? "";
      const cmp = av.toString().localeCompare(bv.toString());
      return sortDescriptor.direction === "ascending" ? cmp : -cmp;
    });
  }, [tasks, sortDescriptor]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
      console.log("Delete task:", id);
    }
  };

  return (
    <div className="min-h-screen bg-[#2C1A0E] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <FiClipboard className="text-[#C8845A]" size={22} />
            <h1 className="text-2xl font-bold text-[#F5E6D3]">My Tasks</h1>
          </div>
          <p className="text-sm text-[rgba(245,230,211,0.55)] ml-7">
            Manage and track all your posted tasks
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {["Open", "In Progress", "Completed", "Cancelled"].map((s) => {
            const count = tasks.filter((t) => t.status === s).length;
            const c = STATUS_COLORS[s];
            return (
              <div
                key={s}
                className="rounded-lg border border-[rgba(255,220,180,0.12)] bg-surface px-4 py-3"
              >
                <p className="text-xs text-[rgba(245,230,211,0.45)] mb-0.5">
                  {s}
                </p>
                <p className={`text-xl font-bold ${c.text}`}>{count}</p>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-[rgba(255,220,180,0.12)] bg-surface overflow-hidden">
          <Table>
            <Table.ScrollContainer>
              <Table.Content
                aria-label="Client tasks table"
                className="min-w-170"
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                classNames={{
                  thead:
                    "[&>tr>th]:bg-[#3A2215] [&>tr>th]:text-[rgba(245,230,211,0.55)]",
                  tr: "hover:bg-transparent data-[hover=true]:bg-transparent",
                  td: "group-data-[hover=true]:bg-transparent",
                }}
              >
                <Table.Header>
                  <Table.Column allowsSorting isRowHeader id="title">
                    {({ sortDirection }) => (
                      <Table.SortableColumnHeader sortDirection={sortDirection}>
                        Task Title
                      </Table.SortableColumnHeader>
                    )}
                  </Table.Column>
                  <Table.Column allowsSorting id="category">
                    {({ sortDirection }) => (
                      <Table.SortableColumnHeader sortDirection={sortDirection}>
                        Category
                      </Table.SortableColumnHeader>
                    )}
                  </Table.Column>
                  <Table.Column allowsSorting id="status">
                    {({ sortDirection }) => (
                      <Table.SortableColumnHeader sortDirection={sortDirection}>
                        Status
                      </Table.SortableColumnHeader>
                    )}
                  </Table.Column>
                  <Table.Column id="actions">Actions</Table.Column>
                </Table.Header>

                <Table.Body>
                  {sorted.map((task) => {
                    const sc = STATUS_COLORS[task.status] ?? STATUS_COLORS.Open;
                    return (
                      <Table.Row key={task._id} id={task._id}>
                        {/* Title */}
                        <Table.Cell>
                          <span className="text-sm font-medium text-[#F5E6D3]">
                            {task.title}
                          </span>
                        </Table.Cell>

                        {/* Category */}
                        <Table.Cell>
                          <span className="text-sm text-text-secondary">
                            {CATEGORY_LABELS[task.category] ?? task.category}
                          </span>
                        </Table.Cell>

                        {/* Status badge */}
                        <Table.Cell>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                            />
                            {task.status}
                          </span>
                        </Table.Cell>

                        {/* Actions */}
                        <Table.Cell>
                          <div className="flex items-center gap-1">
                            {/* View */}
                            <button
                              title="View"
                              className="p-1.5 cursor-pointer rounded-md text-[rgba(245,230,211,0.55)] hover:text-black  transition"
                            >
                              <FiEye size={15} />
                            </button>
                            {/* Edit */}
                            <button
                              title="Edit"
                              className="p-1.5 cursor-pointer rounded-md text-[rgba(245,230,211,0.55)] hover:text-blue-700  transition"
                            >
                              <FiEdit2 size={15} />
                            </button>
                            {/* Delete */}
                            <button
                              title="Delete"
                              onClick={() => handleDelete(task._id)}
                              className="p-1.5 cursor-pointer rounded-md text-[rgba(245,230,211,0.55)] hover:text-red-700  transition"
                            >
                              <FiTrash2 size={15} />
                            </button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>

          {/* Empty state */}
          {tasks.length === 0 && (
            <div className="py-16 text-center">
              <FiClipboard
                className="mx-auto text-[rgba(245,230,211,0.2)] mb-3"
                size={36}
              />
              <p className="text-sm text-text-muted">No tasks posted yet.</p>
            </div>
          )}
        </div>

        <p className="text-xs text-[rgba(245,230,211,0.25)] text-center mt-4">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
        </p>
      </div>
    </div>
  );
};

export default ClientTasksTable;
