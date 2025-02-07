import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ApplyLeaveModal from "./modals/apply-leave-modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDate, getStatusClasses } from "@/lib/utils";
import { applyForLeave, getEmployeeLeaves } from "@/api/leave.api";
import { ApplyLeaveFormData, Leave } from "@/types/leave.types";
import { Link } from "react-router-dom";

export default function EmployeeLeave() {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["leaves"],
    queryFn: getEmployeeLeaves,
  });

  const applyLeaveMutation = useMutation({
    mutationFn: applyForLeave,
    onSuccess: () => {
      toast.success("Leave appllied");
      closeApplyModal();
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    },
    onError: (error) => {
      console.log(error);
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
              <th className="text-left p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.leaveRequests.length > 0 ? (
              data.leaveRequests.map((leave: Leave) => {
                const statusClass = getStatusClasses(leave.status);
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
                    <td className={`p-2 border capitalize ${statusClass}`}>
                      {leave.status}
                    </td>
                    <td className={`p-2 border capitalize`}>
                      <Button variant={"outline"}>
                        <Link to={`/dashboard/employee/leave/${leave._id}`}>
                          View
                        </Link>
                      </Button>
                    </td>
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
