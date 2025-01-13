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
import EmployeeSignin from "./pages/employee/employee-signin";
import EmployeeLayout from "./layouts/employee-layout";
import EmployeeDashboard from "./pages/employee/employee-dashboard";
import EmployeeGuard from "./guards/employee-guard";
import AcceptInvite from "./pages/employee/accept-invite";
import EmployeeDetail from "./pages/tenant/employee-detail";
import EmployeeRoles from "./pages/tenant/employee-roles";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Home</div>,
    },
    {
      path: "/tenant/login",
      element: <TenantLogin />,
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
          ],
        },
      ],
    },
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
              path: ":employeeId",
              element: <EmployeeDetail />,
            },
          ],
        },
      ],
    },
    {
      path: "/signin",
      element: <EmployeeSignin />,
    },
    {
      path: "/:tenantId/verify",
      element: <AcceptInvite />,
    },
    //Admin
    {
      path: "/dashboard/admin",
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
