import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { formatDate } from "@/lib/utils";

interface LeaveActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { status: "approved" | "rejected"; reason: string }) => void;
  isSubmitting: boolean;
  leaveRequest?: {
    employee: { name: string };
    startDate: string;
    resumptionDate: string;
  };
}

export default function LeaveRequestActionModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  leaveRequest,
}: LeaveActionModalProps) {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      status: "" as "approved" | "rejected",
      reason: "",
    },
  });

  const status = watch("status");

  const onSubmitForm = (data: {
    status: "approved" | "rejected";
    reason: string;
  }) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {status === "rejected" ? "Reject" : "Approve"} Leave Request
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">
              Employee: {leaveRequest?.employee?.name}
            </p>
            <p className="text-sm">
              <span className="font-medium">Duration:</span>{" "}
              {formatDate(leaveRequest?.startDate || "")} -{" "}
              {formatDate(leaveRequest?.resumptionDate || "")}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reason</label>
            <Textarea
              {...register("reason")}
              placeholder={`Enter reason for ${status || "action"}...`}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isSubmitting}
              onClick={() => {
                const data = {
                  status: "rejected" as const,
                  reason: watch("reason"),
                };
                onSubmit(data);
              }}
            >
              Reject
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                const data = {
                  status: "approved" as const,
                  reason: watch("reason"),
                };
                onSubmit(data);
              }}
            >
              Approve
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
