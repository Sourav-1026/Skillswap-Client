import React from "react";
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
} from "react-icons/fi";

const stats = [
  {
    label: "Total Proposals",
    value: 0,
    prefix: "",
    sub: "All time",
    icon: <FiFileText size={18} />,
  },
  {
    label: "Pending Proposals",
    value: 0,
    prefix: "",
    sub: "Awaiting response",
    icon: <FiClock size={18} />,
  },
  {
    label: "Accepted Proposals",
    value: 0,
    prefix: "",
    sub: "Confirmed",
    icon: <FiCheckCircle size={18} />,
  },
  {
    label: "Total Earnings (USD)",
    value: 0,
    prefix: "$",
    sub: "All time",
    icon: <FiDollarSign size={18} />,
  },
];

const FreelancerPage = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-foreground">
                {stat.label}
              </span>
              <span className="bg-primary/15 text-primary rounded-lg p-1.75 flex items-center justify-center">
                {stat.icon}
              </span>
            </div>
            <div>
              <p className="text-[28px] font-medium text-shadow-accent leading-none">
                {stat.prefix}
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreelancerPage;
