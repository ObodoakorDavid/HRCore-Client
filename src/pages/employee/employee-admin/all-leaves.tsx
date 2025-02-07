import { getAllLeaves } from "@/api/leave.api";
import { formatDate } from "@/lib/utils";
import { Leave } from "@/types/leave.types";
import { useQuery } from "@tanstack/react-query";

export default function AllLeaves() {
  const { data, isLoading } = useQuery({
    queryKey: ["leaves"],
    queryFn: getAllLeaves,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-semibold">Leave History</h1>
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
    </div>
  );
}
