import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AdminSidebar from "../components/admin/AdminSidebar";
import Navbar from "../components/common/Navbar";

const AdminLayout = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex overflow-x-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <Navbar variant="static" />
        <main className="min-w-0 overflow-x-hidden p-4 md:p-6">
          <div className="mx-auto w-full min-w-0 max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
