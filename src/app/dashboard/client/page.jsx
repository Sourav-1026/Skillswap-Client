import React from "react";
import {
  MdOutlineList,
  MdOutlineRadioButtonUnchecked,
  MdOutlineLoop,
  MdOutlineAttachMoney,
} from "react-icons/md";

const ClientPage = () => {
  const stats = [
    { label: "Total Tasks", value: 0, icon: <MdOutlineList size={20} /> },
    {
      label: "Open Tasks",
      value: 0,
      icon: <MdOutlineRadioButtonUnchecked size={20} />,
    },
    { label: "Tasks In Progress", value: 0, icon: <MdOutlineLoop size={20} /> },
    {
      label: "Total Spent (USD)",
      value: "$0",
      icon: <MdOutlineAttachMoney size={20} />,
    },
  ];

  return (
    <div className="p-6">
      <h1
        className="text-2xl font-medium mb-6"
        style={{ color: "var(--color-text-primary)" }}
      >
        Client Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              padding: "1.25rem",
            }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "13px",
                }}
              >
                {stat.label}
              </span>
              <span
                style={{
                  background: "rgba(200,132,90,0.15)",
                  borderRadius: "8px",
                  padding: "6px",
                  color: "var(--color-accent)",
                  display: "flex",
                }}
              >
                {stat.icon}
              </span>
            </div>
            <span
              style={{
                color: "var(--color-text-primary)",
                fontSize: "28px",
                fontWeight: 500,
              }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientPage;
