"use client";

import { authFetch } from "@/lib/api";
import { AlertDialog, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function DeleteTaskAdmin({ t }) {
  const router = useRouter();
  const handleDeleteTask = async (id) => {
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${id}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        toast.success("Task deleted successfully!");
        router.refresh();
      } else {
        toast.error("Failed to delete task.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    }
  };

  return (
    <AlertDialog>
      <Button className="text-red-600 hover:text-red-800 bg-transparent font-medium text-sm transition-colors">
        Delete
      </Button>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100 bg-accent-text">
            <AlertDialog.CloseTrigger
              className={"bg-accent text-accent-text"}
            />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading className="text-accent">
                Delete task permanently?
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                This will permanently delete <strong>{t.title}</strong> and all
                of its data. This action cannot be undone.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" className={"text-black bg-accent"}>
                Cancel
              </Button>
              <Button
                slot="close"
                variant="danger"
                onClick={() => handleDeleteTask(t._id)}
              >
                Delete Task
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
