import { Home, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEmployeeActions, useEmployeeStore } from "@/store/useEmployeeStore";

interface Submenu {
  name: string;
  path: string;
  icon: JSX.Element;
}

interface Route {
  name: string;
  path: string;
  icon: JSX.Element;
  submenu?: Submenu[];
}

const routes: Route[] = [
  {
    name: "Dashboard",
    path: "/dashboard/employee",
    icon: <Home className="w-5 h-5" />,
  },
  {
    name: "Leave",
    path: "/dashboard/employee/leave",
    icon: <User className="w-5 h-5" />,
  },
  {
    name: "Profile",
    path: "/dashboard/employee/profile",
    icon: <User className="w-5 h-5" />,
  },
];

// const bottomRoutes: Route[] = [
//   {
//     name: "Settings",
//     path: "/dashboard/settings",
//     icon: <Settings className="w-5 h-5" />,
//   },
// ];

export default function EmployeeSidebar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const { logout } = useEmployeeActions();
  const { employee } = useEmployeeStore();

  const navigate = useNavigate();

  const toggleMenu = (menuName: string) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  const isActive = (path: string) =>
    location.pathname.toLowerCase() === path.toLowerCase();

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  return (
    <aside
      className={cn(
        "w-54 h-screen bg-white border-r shadow-md flex flex-col justify-between"
      )}
    >
      {/* Logo Section */}
      <div className="p-4 border-b">
        <h1 className="text-lg font-bold">Employee Dashboard</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {routes.map((route, index) => (
            <li key={index}>
              {route.submenu ? (
                <div>
                  {/* Parent menu with toggle */}
                  <Link
                    to={route.path}
                    className={cn(
                      "flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-100 text-gray-700",
                      isActive(route.path) && "bg-gray-200 text-gray-900"
                    )}
                    onClick={() => toggleMenu(route.name)}
                  >
                    <div className="flex items-center space-x-3">
                      {route.icon}
                      <span>{route.name}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        openMenu === route.name ? "rotate-180" : "rotate-0"
                      )}
                    />
                  </Link>

                  {/* Submenu */}
                  {openMenu === route.name && (
                    <ul className="mt-2 text-left space-y-2">
                      {route.submenu.map((submenu, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            to={submenu.path}
                            className={cn(
                              "flex items-center space-x-3 p-2 pl-8 rounded-md hover:bg-gray-100 text-gray-600",
                              isActive(submenu.path) &&
                                "bg-gray-200 text-gray-900"
                            )}
                          >
                            {submenu.icon}
                            <span>{submenu.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={route.path}
                  className={cn(
                    "flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 text-gray-700",
                    isActive(route.path) && "bg-gray-200 text-gray-900"
                  )}
                >
                  {route.icon}
                  <span>{route.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* <div className="px-4 flex-end">
        <Separator className="my-2" />
        <ul className="space-y-2">
          {bottomRoutes.map((route, index) => (
            <li key={index}>
              <Link
                to={route.path}
                className={cn(
                  "flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 text-gray-700",
                  isActive(route.path) && "bg-gray-200 text-gray-900"
                )}
              >
                {route.icon}
                <span>{route.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div> */}

      <div className="relative">
        <Separator className="my-2" />
        <div
          className="py-1 flex items-center justify-center cursor-pointer hover:bg-gray-100"
          onClick={toggleProfileDropdown}
        >
          <div>
            <p className="text-sm text-gray-500">{employee.name}</p>
            <p className="font-semibold text-sm">{employee.email}</p>
            {/* <p className="text-sm text-gray-500">{employee.position}</p> */}
          </div>
        </div>

        {profileDropdownOpen && (
          <div className="absolute bottom-16 w-full p-4 bg-white border shadow-md rounded-md">
            <div>
              <p className="font-semibold">{employee.name}</p>
              <p className="text-sm text-gray-500">{employee.position}</p>
              <p className="text-sm text-gray-500">{employee.email}</p>
            </div>
          </div>
        )}
      </div>

      <div className="pb-6">
        <Separator className="my-2" />
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-center space-x-2 text-gray-700 hover:bg-gray-100"
          onClick={() => logout(navigate)}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
