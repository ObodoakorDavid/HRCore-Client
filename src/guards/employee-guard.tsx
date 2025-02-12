import { getLoggedInEmployee } from "@/api/employee.api";
import { AuthLoader } from "@/components/loader";
import { useEmployeeActions, useEmployeeStore } from "@/store/useEmployeeStore";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function EmployeeGuard() {
  const navigate = useNavigate();

  const { setAuthEmployee } = useEmployeeActions();

  const {
    data: employee,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["employee"],
    queryFn: () => getLoggedInEmployee(navigate, setAuthEmployee),
    retry: false,
  });

  if (isLoading) {
    return <AuthLoader isLoading={isLoading} />;
  }

  if (isError || !employee) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function IsEmployeeAdmin() {
  const { employee } = useEmployeeStore();

  if (!employee?.isAdmin) {
    return <div className="mt-2">You don't have rights to this page</div>;
  }

  return <Outlet />;
}
