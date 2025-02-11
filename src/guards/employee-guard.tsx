import { Loader } from "@/components/loader";
import { useEmployeeActions, useEmployeeStore } from "@/store/useEmployeeStore";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function EmployeeGuard() {
  const { getEmployee } = useEmployeeActions();
  const { employee, isFetchingEmployee } = useEmployeeStore();

  const navigate = useNavigate();

  useEffect(() => {
    getEmployee(navigate);
  }, [getEmployee, navigate]);

  if (isFetchingEmployee || !employee) {
    return <Loader isLoading={isFetchingEmployee} />;
  }

  return employee ? <Outlet /> : <Navigate to="/login" replace />;
}

export function IsEmployeeAdmin() {
  const { employee } = useEmployeeStore();

  if (!employee?.isAdmin) {
    return <div className="mt-2">You don't have rights to this page</div>;
  }

  return <Outlet />;
}
