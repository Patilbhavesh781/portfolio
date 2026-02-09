import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { useAuth } from "../hooks/useAuth";
import { setSEO } from "../utils/seo";

const Login = () => {
  const { login, isAuthenticated, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    setSEO({
      title: "Login | Admin Access",
      description:
        "Secure login for portfolio admin dashboard to manage projects, blogs, and content.",
      keywords: "Admin Login, Dashboard, Portfolio Management",
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>

        {error && (
          <p className="text-center text-red-600 text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader size="sm" /> : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
