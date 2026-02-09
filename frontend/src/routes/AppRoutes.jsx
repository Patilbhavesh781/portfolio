import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/Home";
import About from "../pages/About";
import Projects from "../pages/Projects";
import ProjectPage from "../pages/ProjectPage";
import Blog from "../pages/Blog";
import BlogPage from "../pages/BlogPage";
import Resume from "../pages/Resume";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Admin from "../pages/Admin";

import Dashboard from "../components/admin/Dashboard";
import ManageProjects from "../components/admin/ManageProjects";
import ManageBlogs from "../components/admin/ManageBlogs";
import ManageSkills from "../components/admin/ManageSkills";
import ManageExperience from "../components/admin/ManageExperience";
import ManageMessages from "../components/admin/ManageMessages";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPage />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Admin Redirect */}
      <Route path="/admin" element={<Admin />} />

      {/* Admin Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/projects" element={<ManageProjects />} />
        <Route path="/admin/blogs" element={<ManageBlogs />} />
        <Route path="/admin/skills" element={<ManageSkills />} />
        <Route path="/admin/experience" element={<ManageExperience />} />
        <Route path="/admin/messages" element={<ManageMessages />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
