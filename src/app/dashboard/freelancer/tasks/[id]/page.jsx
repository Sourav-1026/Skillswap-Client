import ProposalForm from "@/components/dashboard/ProposalForm";
import { getSingleTask } from "@/lib/api/tasks";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiHash,
  FiTag,
  FiSend,
} from "react-icons/fi";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const categoryLabel = (cat) =>
  cat
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" / ");

const TaskDetailPage = async ({ params }) => {
  const { id } = await params;
  const res = await getSingleTask(id);
  const task = res;

  if (!task) return <p className="text-shadow-accent p-6">Task not found.</p>;

  const {
    _id,
    title,
    category,
    description,
    budget,
    deadline,
    clientName,
    clientEmail,
    status,
  } = task;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="text-xs font-medium bg-primary/15 text-primary rounded-md px-2.5 py-1">
            {categoryLabel(category)}
          </span>
          <span className="text-xs font-medium bg-green-500/10 text-green-400 rounded-md px-2.5 py-1">
            {status}
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-shadow-accent mb-3">
          {title}
        </h1>
        <div className="flex flex-wrap gap-4">
          {[
            { icon: <FiUser size={14} />, text: clientName },
            { icon: <FiMail size={14} />, text: clientEmail },
            {
              icon: <FiCalendar size={14} />,
              text: `Due ${formatDate(deadline)}`,
            },
            { icon: <FiDollarSign size={14} />, text: `Budget: $${budget}` },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-1.5 text-sm text-secondary-foreground"
            >
              <span className="text-primary">{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left — Task Detail Card */}
        <div className="flex-1">
          <div className="bg-surface border border-border rounded-xl p-5">
            {/* Description */}
            <div className="flex gap-3 mb-5">
              <div className="w-1 rounded-r-sm bg-primary shrink-0 self-stretch" />
              <div>
                <p className="text-xs font-medium text-primary flex items-center gap-1.5 mb-1.5">
                  <FiFileText size={13} /> Description
                </p>
                <p className="text-sm text-shadow-accent leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            <div className="border-t text-shadow-accent border-border pt-4 grid grid-cols-2 gap-3">
              {[
                {
                  icon: <FiHash size={12} />,
                  label: "Task ID",
                  value: `${_id.slice(0, 8)}...${_id.slice(-4)}`,
                },
                {
                  icon: <FiTag size={12} />,
                  label: "Category",
                  value: categoryLabel(category),
                },
                {
                  icon: <FiDollarSign size={12} />,
                  label: "Budget",
                  value: `$${budget}`,
                  accent: true,
                },
                {
                  icon: <FiCalendar size={12} />,
                  label: "Deadline",
                  value: formatDate(deadline),
                },
              ].map(({ icon, label, value, accent }) => (
                <div
                  key={label}
                  className="bg-background rounded-lg p-3.5 flex flex-col gap-1"
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="text-primary">{icon}</span>
                    {label}
                  </div>
                  <p className={`text-sm font-medium text-shadow-accent`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Proposal Form */}
        <div className="w-full lg:w-75 shrink-0">
          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="text-base font-semibold text-shadow-accent flex items-center gap-2 mb-5">
              <FiSend size={15} className="text-shadow-accent" /> Submit a
              Proposal
            </h2>
            <ProposalForm task={task} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
