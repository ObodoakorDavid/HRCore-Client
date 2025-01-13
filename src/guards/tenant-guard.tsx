import { useTenantActions, useTenantStore } from "@/store/useTenantStore";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function TenantGuard() {
  const { getTenantDetails } = useTenantActions();
  const { tenant, isFetchingTenant } = useTenantStore();

  const navigate = useNavigate();

  useEffect(() => {
    getTenantDetails(navigate);
  }, [getTenantDetails, navigate]);

  // Show a loading state while tenant details are being fetched
  if (isFetchingTenant || !tenant) {
    return <div className="mt-2">Loading...</div>;
  }

  // Only decide on navigation after fetching is complete
  return tenant ? <Outlet /> : <Navigate to="/tenant/login" replace />;
}
