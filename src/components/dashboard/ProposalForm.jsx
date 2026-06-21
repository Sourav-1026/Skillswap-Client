"use client";
import { useState } from "react";
import { FiSend } from "react-icons/fi";
import {
  Form,
  TextField,
  Label,
  Input,
  TextArea,
  FieldError,
  Button,
} from "@heroui/react";
import { createProposal } from "@/lib/actions/tasks";
import { toast } from "react-toastify";

const ProposalForm = ({ task }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const newData = {
      ...data,
      status: "Pending",
      submittedAt: new Date().toISOString(),
      taskTitle: task.title,
      taskId: task._id,
    };
    setIsLoading(true);
    try {
      // TODO: wire up your API call here
      const res = await createProposal(newData);
      if (res.insertedId) {
        toast.success("Submitter Proposal Successfully");
        console.log(res);
        console.log("Proposal submitted:", newData);
      } else {
        toast.error("Something went wrong. Try Again!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  //   const inputClass =
  //     "w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";
  //   const labelClass =
  //     "block text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5";

  return (
    <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Task ID — read only, not a real field */}
      <div className="flex flex-col gap-1.5">
        <span className={"text-accent"}>Task ID</span>
        <p className="text-xs text-primary opacity-60 bg-background border border-border rounded-lg px-3 py-2.5 cursor-not-allowed truncate">
          {task._Id}
        </p>
      </div>

      <TextField name="freelancerEmail" type="email" isRequired>
        <Label className="text-accent">Freelancer Email</Label>
        <Input
          className="bg-background text-white"
          placeholder="you@example.com"
        />
        <FieldError className="text-xs text-red-400 mt-1" />
      </TextField>

      <div className="grid grid-cols-2 gap-3">
        <TextField name="proposedBudget" type="number" isRequired>
          <Label className={"text-accent"}>Budget (USD)</Label>
          <Input
            className={"bg-accent-text text-white"}
            placeholder="e.g. 350"
          />
          <FieldError className="text-xs text-red-400 mt-1" />
        </TextField>

        <TextField name="estimatedDays" type="number" isRequired>
          <Label className={"text-accent"}>Est. Days</Label>
          <Input className={"bg-accent-text text-white"} placeholder="e.g. 7" />
          <FieldError className="text-xs text-red-400 mt-1" />
        </TextField>
      </div>

      <TextField name="coverNote" isRequired>
        <Label className={"text-accent"}>Cover Note</Label>
        <TextArea
          className={`bg-accent-text text-white resize-none`}
          rows={4}
          placeholder="Why are you a great fit for this task?"
        />
        <FieldError className="text-xs text-red-400 mt-1" />
      </TextField>

      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full bg-accent text-accent-text rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors"
      >
        <FiSend size={14} /> Send Proposal
      </Button>
    </Form>
  );
};

export default ProposalForm;
