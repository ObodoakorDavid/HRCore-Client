import EmpployeeSidebar from "@/components/employee-sidebar";
import { Outlet } from "react-router-dom";

export default function EmployeeLayout() {
  return (
    <div className="flex h-screen">
      <EmpployeeSidebar />
      <div className="flex-1 bg-gray-100 p-4">
        <div className=" max-w-5xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
