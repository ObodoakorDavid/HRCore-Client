import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

interface LeaveRequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveRequest: {
    employee?: {
      name: string;
    };
    lineManager?: {
      name: string;
    };
    startDate: string;
    resumptionDate: string;
    status: string;
    description: string;
    reason?: string;
  } | null;
}

const LeaveRequestDetailModal = ({
  isOpen,
  onClose,
  leaveRequest,
}: LeaveRequestDetailModalProps) => {
  if (!leaveRequest) return null;

  const {
    employee,
    lineManager,
    resumptionDate,
    startDate,
    status,
    reason,
    description,
  } = leaveRequest;

  console.log(leaveRequest);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Leave Request Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-gray-500">Employee</div>
            <div className="text-sm font-medium">{employee?.name}</div>

            <div className="text-sm text-gray-500">Line Manager</div>
            <div className="text-sm font-medium">{lineManager?.name}</div>

            <div className="text-sm text-gray-500">Start Date</div>
            <div className="text-sm font-medium">{formatDate(startDate)}</div>

            <div className="text-sm text-gray-500">Resumption Date</div>
            <div className="text-sm font-medium">
              {formatDate(resumptionDate)}
            </div>

            <div className="text-sm text-gray-500">Description</div>
            <div className="text-sm font-medium">{description}</div>

            <div className="text-sm text-gray-500">Status</div>
            <div
              className={`text-sm font-medium capitalize ${
                status == "approved"
                  ? "text-green-300"
                  : status == "rejected"
                  ? "text-red-500"
                  : ""
              }`}
            >
              {leaveRequest.status}
            </div>

            {reason && (
              <>
                <div className="text-sm text-gray-500">Reason</div>
                <div className="text-sm font-medium">{reason}</div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRequestDetailModal;
