import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Home,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const routes = [
  {
    name: "Dashboard",
    path: "/dashboard/tenant",
    icon: <Home className="w-5 h-5" />,
  },
  {
    name: "Profile",
    path: "/dashboard/tenant/profile",
    icon: <User className="w-5 h-5" />,
  },
  {
    name: "Employee",
    path: "/dashboard/tenant/employee",
    icon: <Settings className="w-5 h-5" />,
    submenu: [
      {
        name: "Invites",
        path: "/dashboard/tenant/employee/invite",
        icon: <Mail className="w-4 h-4" />,
      },
      {
        name: "Roles",
        path: "/dashboard/tenant/employee/roles",
        icon: <ShieldCheck className="w-4 h-4" />,
      },
    ],
  },
];

export default function TenantSidebar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();

  const toggleMenu = (menuName: string) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.clear();
    window.location.href = "/tenant/login";
  };

  const isActive = (path: string) =>
    location.pathname.toLowerCase() === path.toLowerCase();

  return (
    <aside
      className={cn(
        "w-64 h-screen bg-white border-r shadow-md flex flex-col justify-between"
      )}
    >
      {/* Logo Section */}
      <div className="p-4 border-b">
        <h1 className="text-lg font-bold">Tenant Portal</h1>
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
                    to={route.name}
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

      {/* Footer Section */}
      <div className="p-4">
        <Separator className="my-2" />
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-center space-x-2 text-gray-700 hover:bg-gray-100"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
