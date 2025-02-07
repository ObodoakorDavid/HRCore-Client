import { ChangeEvent, useState } from "react";
import CustomPagination from "@/components/custom-pagination";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllEmployees, updateEmployeeDetails } from "@/api/employee.api";
import SearchInput from "@/components/search-input";
import EditEmployeeModal from "./modals/edit-employee-modal";
import { Eye } from "lucide-react";
// import DataTable from "@/components/DataTable";

interface Employee {
  _id: string;
  name: string;
  email: string;
  jobRole: string;
  levelId: {
    _id: string;
    name: string;
  };
  createdAt: string;
  isAdmin: boolean;
}

interface EmployeesResponse {
  employees: Employee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function Employee() {
  const [searchParams] = useSearchParams();
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Manage modal state
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null); // Store employee to edit

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";

  const queryClient = useQueryClient();

  // Fetch employees using useQuery
  const { data, isLoading, isError, error } = useQuery<
    EmployeesResponse,
    Error
  >({
    queryKey: ["getAllEmployees", page, search],
    queryFn: () => getAllEmployees({ page, limit: 10, search }),
  });

  const handleCheckboxChange = (employeeId: string) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(employeeId)
        ? prevSelected.filter((id) => id !== employeeId)
        : [...prevSelected, employeeId]
    );
  };

  const handleEditClick = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setIsEditModalOpen(true); // Open modal when edit button is clicked
  };

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && data?.employees) {
      setSelectedEmployees(data.employees.map((employee) => employee._id));
    } else {
      setSelectedEmployees([]);
    }
  };

  // Mutation for making/revoking admin access
  const { mutateAsync: toggleAdminStatus, isPending: isTogglingAdmintatus } =
    useMutation({
      mutationFn: ({
        employeeId,
        isAdmin,
      }: {
        employeeId: string;
        isAdmin: boolean;
      }) => updateEmployeeDetails({ employeeId, isAdmin }),
      onSuccess: () => {
        // Refetch employees after updating admin status
        queryClient.invalidateQueries({ queryKey: ["getAllEmployees"] });
      },
      onError: (error: Error) => {
        console.error("Failed to update admin status:", error);
      },
    });

  // Mutation for updating employee details
  const { mutateAsync: updateEmployee, isPending: isUpdatingEmployee } =
    useMutation({
      mutationFn: (data: any) => updateEmployeeDetails(data),
      onSuccess: () => {
        // Refetch employees after updating admin status
        queryClient.invalidateQueries({ queryKey: ["getAllEmployees"] });
      },
      onError: (error: Error) => {
        console.error("Failed to update admin status:", error);
      },
    });

  console.log(data);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Employees</h1>
        <div className="flex items-center gap-4">
          <SearchInput />
        </div>
      </div>
      <div className="overflow-x-auto">
        {isError ? (
          <div className="p-4 text-center text-red-500">
            Error: {error ? error.message : null}
          </div>
        ) : null}

        {isLoading ? (
          <div className="text-center p-4">Loading employees...</div>
        ) : (
          <table className="w-full bg-white border rounded-md shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      !data
                        ? false
                        : selectedEmployees.length === data?.employees.length
                    }
                    className="w-4 h-4"
                  />
                </th>
                <th className="text-left p-3 border font-medium">Name</th>
                <th className="text-left p-3 border font-medium">Email</th>
                <th className="text-left p-3 border font-medium">Role</th>
                <th className="text-left p-3 border font-medium">Level</th>
                <th className="text-left p-3 border font-medium">Joined On</th>
                <th className="text-left p-3 border font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data && data?.employees.length > 0 ? (
                data?.employees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-50">
                    <td className="p-3 border text-center">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee._id)}
                        onChange={() => handleCheckboxChange(employee._id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="p-3 border">{employee.name ?? "N/A"}</td>
                    <td className="p-3 border">{employee.email}</td>
                    <td className="p-3 border">{employee.jobRole ?? "N/A"}</td>
                    <td className="p-3 border capitalize">
                      {employee.levelId ? employee.levelId.name : "N/A"}
                    </td>
                    <td className="p-3 border">
                      {new Date(employee.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 flex gap-1">
                      <Button
                        onClick={() =>
                          toggleAdminStatus({
                            employeeId: employee._id,
                            isAdmin: !employee.isAdmin,
                          })
                        }
                        disabled={isTogglingAdmintatus}
                        variant={employee.isAdmin ? "destructive" : "default"}
                        size="sm"
                      >
                        {employee.isAdmin ? "Revoke Admin" : "Make Admin"}
                      </Button>
                      <Button
                        onClick={() => handleEditClick(employee)} // Trigger edit on click
                        variant="outline"
                        size="sm"
                      >
                        Update
                      </Button>
                      <Button variant="outline" size="sm">
                        <Link to={`/dashboard/tenant/employee/${employee._id}`}>
                          <Eye />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center">
                    No employees found.
                  </td>
                </tr>
              )}

              {/* <DataTable
              data={data?.employees ?? []}
              columns={columns}
              actions={actions}
              isLoading={isLoading}
              error={error?.message}
              noDataMessage="No employees found"
              selectable
              selectedItems={selectedEmployees}
              onSelectItem={handleCheckboxChange}
              onSelectAll={handleSelectAll}
            /> */}
            </tbody>
          </table>
        )}
      </div>

      {isEditModalOpen && employeeToEdit && (
        <EditEmployeeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={async (data) => {
            await updateEmployee({
              ...data,
              employeeId: employeeToEdit._id,
            });
            setIsEditModalOpen(false); // Close modal after submission
          }}
          employee={employeeToEdit}
          isSubmitting={isUpdatingEmployee} // Add logic to manage submission state if needed
        />
      )}

      {data?.pagination && <CustomPagination pagination={data?.pagination} />}
    </div>
  );
}
