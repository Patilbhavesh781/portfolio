import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";

const AdminSidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/admin", exact: true },
    { name: "Projects", path: "/admin/projects" },
    { name: "Blogs", path: "/admin/blogs" },
    { name: "Skills", path: "/admin/skills" },
    { name: "Experience", path: "/admin/experience" },
    { name: "Messages", path: "/admin/messages" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 h-screen p-6 flex flex-col border-r border-gray-200 dark:border-gray-800">
      {/* Logo / Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          Admin Panel
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Portfolio Management
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg font-medium transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
        <Button
          variant="outline"
          className="w-full"
          onClick={logout}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
