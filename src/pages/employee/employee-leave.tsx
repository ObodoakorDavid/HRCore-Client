import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, PlusCircle } from "lucide-react";
import ApplyLeaveModal from "./modals/apply-leave-modal";
import { useQuery } from "@tanstack/react-query";
import { formatDate, getStatusClasses } from "@/lib/utils";
import { getEmployeeLeaves } from "@/api/leave.api";
import { Link, useSearchParams } from "react-router-dom";
import DataTable from "@/components/table";

export default function EmployeeLeave() {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  
  const { data, isLoading } = useQuery({
    queryKey: ["employee-leaves", { page, limit }],
    queryFn: () => getEmployeeLeaves({ page, limit }),
  });

  const columns = [
    {
      header: "Name",
      accessor: "employee.name",
      render: (_: any, row: any) => row.employee?.name || "N/A",
    },
    {
      header: "Line Manager",
      accessor: "lineManager.name",
      render: (_: any, row: any) => row.lineManager?.name || "N/A",
    },
    {
      header: "Start Date",
      accessor: "startDate",
      render: (value: string) => {
        return formatDate(value);
      },
    },
    {
      header: "Resumption Date",
      accessor: "resumptionDate",
      render: (value: string) => formatDate(value),
    },
    {
      header: "Status",
      accessor: "status",
      isStatus: true,
      render: (value: string) => (
        <span className={`capitalize ${getStatusClasses(value)}`}>{value}</span>
      ),
    },
    {
      header: "Action",
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Link to={`/dashboard/employee/leave/${row._id}`}>
            <Eye />
          </Link>
        </div>
      ),
    },
  ];

  const openApplyModal = () => setIsApplyModalOpen(true);
  const closeApplyModal = () => setIsApplyModalOpen(false);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-semibold">Leave History</h1>
        <Button onClick={openApplyModal}>
          <PlusCircle size={16} className="mr-2" />
          Apply for Leave
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.leaveRequests || []}
        isLoading={isLoading}
        noDataMessage="No leaves found."
        pagination={data?.pagination}
      />

      <ApplyLeaveModal isOpen={isApplyModalOpen} onClose={closeApplyModal} />
    </div>
  );
}
