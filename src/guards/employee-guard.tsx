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
    return <div className="mt-2">Loading...</div>;
  }

  return employee ? <Outlet /> : <Navigate to="/login" replace />;
}
