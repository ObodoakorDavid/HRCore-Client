import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ApplyLeaveModal from "./modals/apply-leave-modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { applyForLeave, getLeaves } from "@/api/leave.api";
import { ApplyLeaveFormData } from "@/types/leave.types";

interface Leave {
  _id: string;
  employeeName: string;
  status: string;
  startDate: string;
  resumptionDate: string;
  employee: {
    name: string;
  };
  lineManager: {
    name: string;
  };
}

export default function EmployeeLeave() {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["leaves"],
    queryFn: getLeaves,
  });

  const applyLeaveMutation = useMutation({
    mutationFn: applyForLeave,
    onSuccess: () => {
      toast.success("Leave appllied");
      closeApplyModal();
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to apply");
    },
  });

  const openApplyModal = () => setIsApplyModalOpen(true);
  const closeApplyModal = () => setIsApplyModalOpen(false);

  const handleApplyLeave = async (data: ApplyLeaveFormData) => {
    applyLeaveMutation.mutate(data);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-semibold">Leave History</h1>
        <Button onClick={openApplyModal}>
          <PlusCircle size={16} className="mr-2" />
          Apply for Leave
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center p-4">Loading leaves...</div>
      ) : (
        <table className="min-w-full bg-white border rounded-md shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 border">Name</th>
              <th className="text-left p-2 border">Line Manager</th>
              <th className="text-left p-2 border">Start Date</th>
              <th className="text-left p-2 border">Resumption Date</th>
              <th className="text-left p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.leaveRequests.length > 0 ? (
              data.leaveRequests.map((leave: Leave) => {
                return (
                  <tr key={leave._id} className="hover:bg-gray-50 text-left">
                    <td className="p-2 border">{leave.employee?.name}</td>
                    <td className="p-2 border">{leave.lineManager?.name}</td>
                    <td className="p-2 border">
                      {formatDate(leave.startDate)}
                    </td>
                    <td className="p-2 border">
                      {formatDate(leave.resumptionDate)}
                    </td>
                    <td className="p-2 border capitalize">{leave.status}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  No leaves found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={closeApplyModal}
        onSubmit={handleApplyLeave}
        isSubmitting={applyLeaveMutation.isPending}
      />
    </div>
  );
}
