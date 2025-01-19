import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import TenantLogin from "./pages/tenant/tenant-login";
import TenantGuard from "./guards/tenant-guard";
import TenantLayout from "./layouts/tenant-layout";
import TenantProfile from "./pages/tenant/tenant-profile";
import TenantDashboard from "./pages/tenant/tenant-dashboard";
import Employee from "./pages/tenant/employee";
import EmployeeInvites from "./pages/tenant/employee-invites";
import EmployeeRegister from "./pages/employee/employee-register";
import EmployeeLayout from "./layouts/employee-layout";
import EmployeeDashboard from "./pages/employee/employee-dashboard";
import EmployeeGuard from "./guards/employee-guard";
import AcceptInvite from "./pages/employee/accept-invite";
import EmployeeRoles from "./pages/tenant/employee-roles";
import AdminLogin from "./pages/admin/admin-login";
import AdminGuard from "./guards/admin-guard";
import AdminLayout from "./layouts/admin-layout";
import Tenants from "./pages/admin/tenants";
import EmployeeProfile from "./pages/employee/employee-profile";
import EmployeeForgotPassword from "./pages/employee/employee-forgot-password";
import EmployeeLogin from "./pages/employee/employee-login";
import EmployeeResetPassword from "./pages/employee/employee-reset-password";
import TenantForgotPassword from "./pages/tenant/tenant-forgot-password";
import TenantResetPassword from "./pages/tenant/tenant-reset-password";
import LandingPage from "./pages/public/landing-page";
import EmployeeProfileUpdate from "./pages/employee/employee-profile-update";
import Leave from "./pages/tenant/leave";
import LeaveHistory from "./pages/tenant/leave-history";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    //Tenant Routes
    {
      path: "/tenant/login",
      element: <TenantLogin />,
    },
    {
      path: "/tenant/forgot-password",
      element: <TenantForgotPassword />,
    },
    {
      path: "/tenant/reset-password",
      element: <TenantResetPassword />,
    },
    {
      path: "/dashboard/tenant",
      element: <TenantGuard />,
      children: [
        {
          element: <TenantLayout />,
          children: [
            {
              path: "",
              element: <TenantDashboard />,
            },
            {
              path: "profile",
              element: <TenantProfile />,
            },
            {
              path: "employee",
              element: <Employee />,
            },
            {
              path: "employee/invite",
              element: <EmployeeInvites />,
            },
            {
              path: "employee/roles",
              element: <EmployeeRoles />,
            },
            {
              path: "leave",
              element: <Leave />,
            },
            {
              path: "leave-history",
              element: <LeaveHistory />,
            },
          ],
        },
      ],
    },
    //Eemployee Routes
    {
      path: "/invite/:tenantId/:token/:email",
      element: <EmployeeRegister />,
    },
    {
      path: "/dashboard/employee",
      element: <EmployeeGuard />,
      children: [
        {
          element: <EmployeeLayout />,
          children: [
            {
              path: "",
              element: <EmployeeDashboard />,
            },
            {
              path: "leave",
              element: <div>Leave management</div>,
            },
            {
              path: "profile",
              element: <EmployeeProfile />,
            },
            {
              path: "profile/update",
              element: <EmployeeProfileUpdate />,
            },
            // {
            //   path: ":employeeId",
            //   element: <EmployeeDetail />,
            // },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: <EmployeeLogin />,
    },
    {
      path: "/forgot-password",
      element: <EmployeeForgotPassword />,
    },
    {
      path: "/reset-password",
      element: <EmployeeResetPassword />,
    },
    {
      path: "/:tenantId/verify",
      element: <AcceptInvite />,
    },
    //Admin Routes
    {
      path: "/admin/login",
      element: <AdminLogin />,
    },
    {
      path: "/dashboard/admin",
      element: <AdminGuard />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            {
              path: "",
              element: <div>Admin Home</div>,
            },
            {
              path: "tenants",
              element: <Tenants />,
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <div>Page Not Found</div>,
    },
  ]);

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
