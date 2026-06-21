"use client";

import { Card } from "@heroui/react";
import {
  FiMail,
  FiDollarSign,
  FiClock,
  FiFileText,
  FiCheck,
  FiX,
} from "react-icons/fi";

const ProposalCard = ({ proposal }) => {
  const handleAccept = () => {
    console.log("Accepted:", proposal.taskId);
    // TODO: call accept API
  };

  const handleReject = () => {
    console.log("Rejected:", proposal.taskId);
    // TODO: call reject API
  };

  return (
    <Card className="w-full bg-[#3A2215] border border-[rgba(255,220,180,0.12)] rounded-xl p-0 shadow-md">
      {/* Header */}
      <Card.Header className="flex flex-col gap-1 px-5 pt-5 pb-3 border-b border-[rgba(255,220,180,0.12)]">
        <div className="flex items-center justify-between">
          <Card.Title className="text-[#F5E6D3] text-base font-semibold">
            {proposal.taskTitle}
          </Card.Title>
          <span>{}</span>
        </div>
        <Card.Description className="text-text-secondary text-xs">
          Task ID: {proposal.taskId}
        </Card.Description>
      </Card.Header>

      {/* Body */}
      <div className="flex flex-col gap-3 px-5 py-4">
        {/* Freelancer Email */}
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <FiMail className="text-[#C8845A] shrink-0" />
          <span>{proposal.freelancerEmail}</span>
        </div>

        {/* Proposed Budget */}
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <FiDollarSign className="text-[#C8845A] shrink-0" />
          <span>
            Proposed Budget:{" "}
            <span className="text-[#F5E6D3] font-medium">
              ${proposal.proposedBudget}
            </span>
          </span>
        </div>

        {/* Estimated Days */}
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <FiClock className="text-[#C8845A] shrink-0" />
          <span>
            Estimated:{" "}
            <span className="text-[#F5E6D3] font-medium">
              {proposal.estimatedDays} day
              {proposal.estimatedDays > 1 ? "s" : ""}
            </span>
          </span>
        </div>

        {/* Cover Note */}
        <div className="flex items-start gap-2 text-sm text-[rgba(245,230,211,0.65)]">
          <FiFileText className="text-[#C8845A] shrink-0 mt-0.5" />
          <p className="leading-relaxed">{proposal.coverNote}</p>
        </div>
      </div>

      {/* Footer — Accept / Reject */}
      <Card.Footer className="flex gap-3 px-5 pb-5 pt-0">
        <button
          onClick={handleAccept}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white text-sm font-medium transition-colors cursor-pointer"
        >
          <FiCheck />
          Accept
        </button>
        <button
          onClick={handleReject}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white text-sm font-medium transition-colors cursor-pointer"
        >
          <FiX />
          Reject
        </button>
      </Card.Footer>
    </Card>
  );
};

export default ProposalCard;
