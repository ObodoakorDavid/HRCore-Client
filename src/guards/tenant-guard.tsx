import { useTenantActions, useTenantStore } from "@/store/useTenantStore";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function TenantGuard() {
  const { getTenant } = useTenantActions();
  const { tenant, isFetchingTenant } = useTenantStore();

  const navigate = useNavigate();

  useEffect(() => {
    getTenant(navigate);
  }, [getTenant, navigate]);

  if (isFetchingTenant || !tenant) {
    return <div className="mt-2">Loading...</div>;
  }

  return tenant ? <Outlet /> : <Navigate to="/tenant/login" replace />;
}
