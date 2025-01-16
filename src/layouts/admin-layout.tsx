import AdminSidebar from "@/components/admin-sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-100 p-4">
        <div className=" max-w-5xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
