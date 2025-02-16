import { getAllLeaves } from "@/api/leave.api";
import LeaveRequestsChart from "@/components/charts/leave-request-chart";
import DataTable from "@/components/table";
import { formatDate, getStatusClasses } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export default function AllLeaves() {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const { data, isLoading } = useQuery({
    queryKey: ["all-leaves", { page, limit }],
    queryFn: () => getAllLeaves({ page, limit }),
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
          <Link to={`/dashboard/employee/all-leaves/${row._id}`}>
            <Eye />
          </Link>
        </div>
      ),
    },
  ];

  // const defaultPagination = {
  //   totalCount: 0,
  //   totalPages: 0,
  //   currentPage: 1,
  //   perPage: 10,
  // };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-semibold">Leave History</h1>
      </div>
      <LeaveRequestsChart />
      <DataTable
        columns={columns}
        data={data?.leaveRequests || []}
        isLoading={isLoading}
        noDataMessage="No leaves found."
        pagination={data?.pagination}
      />
    </div>
  );
}
