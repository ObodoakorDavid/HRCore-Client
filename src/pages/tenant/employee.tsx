import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/components/custom-pagination";
import { useTenantActions, useTenantStore } from "@/store/useTenantStore";
import { useSearchParams } from "react-router-dom";
// import { Link } from "react-router-dom"; // Import Link component

export default function Employee() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { employees, pagination } = useTenantStore();
  const { getAllEmployees } = useTenantActions();
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("search", debouncedSearch);
        return newParams;
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearch, setSearchParams]);

  // Fetch employees
  useEffect(() => {
    getAllEmployees({ page, limit: 10, search });
  }, [page, search, getAllEmployees]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDebouncedSearch(e.target.value);
  };

  const handleCheckboxChange = (employeeId: string) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(employeeId)
        ? prevSelected.filter((id) => id !== employeeId)
        : [...prevSelected, employeeId]
    );
  };

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedEmployees(employees.map((employee) => employee._id));
    } else {
      setSelectedEmployees([]);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-semibold">Employees</h1>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search by name or email"
            value={debouncedSearch}
            onChange={handleSearchChange}
            className="mr-2"
          />
        </div>
      </div>

      <table className="min-w-full bg-white border rounded-md shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedEmployees.length === employees.length}
              />
            </th>
            <th className="text-left p-2 border">Name</th>
            <th className="text-left p-2 border">Email</th>
            <th className="text-left p-2 border">Role</th>
            <th className="text-left p-2 border">Joined On</th>
            {/* <th className="text-left p-2 border">Details</th> */}
          </tr>
        </thead>
        <tbody>
          {employees
            ? employees?.map((employee) => {
                return (
                  <tr key={employee?._id} className="hover:bg-gray-50">
                    <td className="p-2 border">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee._id)}
                        onChange={() => handleCheckboxChange(employee._id)}
                      />
                    </td>
                    <td className="text-left p-2 border">
                      {employee.name ?? "N/A"}
                    </td>
                    <td className="text-left p-2 border">{employee?.email}</td>
                    <td className="text-left p-2 border">
                      {employee?.jobRole ?? "N/A"}
                    </td>
                    <td className="text-left p-2 border">
                      {new Date(employee.createdAt).toLocaleDateString()}
                    </td>
                    {/* <td className="text-left p-2 border text-blue-500 underline font-semibold">
            <Link to={`/dashboard/employee/${employee._id}`}>Details</Link>
          </td> */}
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>

      <CustomPagination pagination={pagination} />
    </div>
  );
}
