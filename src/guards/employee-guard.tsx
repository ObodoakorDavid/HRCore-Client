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

  // Show a loading state while employee details are being fetched
  if (isFetchingEmployee || !employee) {
    return <div className="mt-2">Loading...</div>;
  }

  // Only decide on navigation after fetching is complete
  return employee ? <Outlet /> : <Navigate to="/tenant/login" replace />;
  return <div>EmployeeGuard</div>;
}
