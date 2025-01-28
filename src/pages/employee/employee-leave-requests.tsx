import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import LeaveRequestActionModal from "./modals/leave-request-action-modal";
import LeaveRequestDetailModal from "./modals/leave-request-detail-modal";
import { fetchManagerLeaveRequest, updateLeaveRequest } from "@/api/leave.api";

interface Leave {
  _id: string;
  employeeName: string;
  status: string;
  startDate: string;
  resumptionDate: string;
  description: string;
  employee: {
    name: string;
  };
  lineManager: {
    name: string;
  };
}

export default function EmployeeLeaveRequests() {
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["lineManagerLeaves"],
    queryFn: fetchManagerLeaveRequest,
  });

  const leaveActionMutation = useMutation({
    mutationFn: updateLeaveRequest,
    onSuccess: () => {
      toast.success("Leave request updated successfully");
      setIsActionModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["lineManagerLeaves"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        return toast.error(error.message);
      }
      toast.error("Failed to update leave request");
    },
  });

  const handleAction = async (data: {
    status: "approved" | "rejected";
    reason: string;
  }) => {
    if (!selectedLeave) return;

    leaveActionMutation.mutate({
      leaveId: selectedLeave._id,
      status: data.status,
      reason: data.reason,
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-semibold">Line Manager Leave Requests</h1>
      </div>

      {isLoading ? (
        <div className="text-center p-4">Loading leave requests...</div>
      ) : (
        <table className="min-w-full bg-white border rounded-md shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 border">Name</th>
              <th className="text-left p-2 border">Line Manager</th>
              <th className="text-left p-2 border">Start Date</th>
              <th className="text-left p-2 border">End Date</th>
              <th className="text-left p-2 border">Status</th>
              <th className="text-left p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.leaveRequests?.length > 0 ? (
              data.leaveRequests.map((leave: Leave) => (
                <tr key={leave._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{leave.employee?.name}</td>
                  <td className="p-2 border">{leave.lineManager?.name}</td>
                  <td className="p-2 border">{formatDate(leave.startDate)}</td>
                  <td className="p-2 border">
                    {formatDate(leave.resumptionDate)}
                  </td>
                  <td className="p-2 border capitalize">{leave.status}</td>
                  <td className="p-2 border flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedLeave(leave);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                    {leave.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedLeave(leave);
                            setIsActionModalOpen(true);
                          }}
                        >
                          Update
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {selectedLeave && (
        <LeaveRequestActionModal
          isOpen={isActionModalOpen}
          onClose={() => {
            setIsActionModalOpen(false);
            setSelectedLeave(null);
          }}
          onSubmit={handleAction}
          isSubmitting={leaveActionMutation.isPending}
          leaveRequest={selectedLeave}
        />
      )}

      <LeaveRequestDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedLeave(null);
        }}
        leaveRequest={selectedLeave}
      />
    </div>
  );
}
