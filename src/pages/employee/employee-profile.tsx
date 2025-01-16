import { useEmployeeStore } from "@/store/useEmployeeStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function EmployeeProfile() {
  const { employee } = useEmployeeStore();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-start">Employee Profile</h1>
      <div className="flex justify-end my-4">
        <Button onClick={() => navigate("/dashboard/employee/profile/update")}>
          Update Profile
        </Button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 text-start">
        <div className="mb-4 flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <p className="text-gray-600">
            <span className="font-semibold">Name:</span>{" "}
            {employee.name ?? "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Email:</span> {employee.email}
          </p>
          {/* <p className="text-gray-600">
            <span className="font-semibold">Position:</span> {employee.position}
          </p> */}
        </div>
      </div>
    </div>
  );
}
