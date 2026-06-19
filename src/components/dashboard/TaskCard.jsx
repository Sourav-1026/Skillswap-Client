import React from "react";
import { Card } from "@heroui/react";
import { FiUser, FiCalendar } from "react-icons/fi";
import Link from "next/link";

const categoryLabel = (cat) =>
  cat
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" / ");

const formatDeadline = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const TaskCard = ({ task }) => {
  const { _id, title, category, budget, deadline, clientName } = task;

  return (
    <Card className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4">
      <Card.Header className="p-0 flex flex-row items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <Card.Title className="text-accent text-[15px] font-medium leading-snug">
            {title}
          </Card.Title>
          <span className="inline-block text-[11px] font-medium bg-primary/15 text-primary rounded-md px-2.5 py-1 w-fit capitalize">
            {categoryLabel(category)}
          </span>
        </div>
        <span className="text-primary text-lg font-medium whitespace-nowrap">
          ${budget}
        </span>
      </Card.Header>

      <Card.Content className="p-0 border-t border-border pt-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FiUser size={14} className="text-muted-foreground" />
          <span className="text-sm text-secondary-foreground">
            {clientName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FiCalendar size={14} className="text-muted-foreground" />
          <span className="text-sm text-secondary-foreground">
            Due {formatDeadline(deadline)}
          </span>
        </div>
      </Card.Content>

      <Card.Footer className="p-0 mt-auto">
        <Link
          href={`/dashboard/freelancer/tasks/${_id}`}
          className="w-full bg-accent text-accent-text rounded-lg py-2 text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          Apply Now
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default TaskCard;
