import { getEmployeeDetails } from "@/api/employee.api";
import { Loader } from "@/components/loader";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function EmployeeDetail() {
  const { employeeId } = useParams<{ employeeId: string }>();

  const {
    data: employee,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["employeeDetail", employeeId],
    queryFn: () => getEmployeeDetails(employeeId),
  });

  if (isLoading) return <Loader isLoading={isLoading} />;
  if (isError) return <div>Error fetching details: {error.message}</div>;

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Employee Details</h2>
      <p>
        <strong>Name:</strong> {employee.name}
      </p>
      <p>
        <strong>Email:</strong> {employee.email}
      </p>
      <p>
        <strong>Position:</strong> {employee.position}
      </p>
      <p>
        <strong>Department:</strong> {employee.department}
      </p>
    </div>
  );
}
