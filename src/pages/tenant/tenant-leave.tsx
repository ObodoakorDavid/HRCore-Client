import { getAllLeaves } from "@/api/leave.api";
import DataTable from "@/components/table";
import { formatDate, getStatusClasses } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export default function TenantLeave() {
  const [searchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["leaves", { page, limit: 10, search }],
    queryFn: () => getAllLeaves({ page, limit: 10, search }),
  });

  const columns = [
    {
      header: "Name",
      // accessor: "employee.name",
      render: (_: any, row: any) => row?.employee?.name || "N/A",
    },
    {
      header: "Line Manager",
      // accessor: "lineManager",
      render: (_: any, row: any) => row?.lineManager?.name || "N/A",
    },
    {
      header: "Start Data",
      // accessor: "startDate",
      render: (_: any, row: any) => formatDate(row?.startDate) || "N/A",
    },
    {
      header: "Resumption Date",
      // accessor: "resumptionDate",
      render: (_: any, row: any) => formatDate(row?.resumptionDate) || "N/A",
    },
    {
      header: "Status",
      accessor: "status",
      isStatus: true,
      render: (_: any, row: any) => (
        <span className={`capitalize ${getStatusClasses(row?.status)}`}>
          {row?.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-semibold">Leave History</h1>
      </div>

      <DataTable
        columns={columns}
        data={data?.leaveRequests || []}
        isLoading={isLoading}
        noDataMessage="No leave request found."
        pagination={data?.pagination}
      />
    </div>
  );
}
