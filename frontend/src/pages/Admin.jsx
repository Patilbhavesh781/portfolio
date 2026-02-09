import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { setSEO } from "../utils/seo";

const Admin = () => {
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    setSEO({
      title: "Admin Dashboard | Portfolio",
      description:
        "Manage portfolio content including projects, blogs, skills, experience, and messages.",
      keywords: "Admin Dashboard, Portfolio Management, CMS",
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/admin/dashboard" replace />;
};

export default Admin;
