import { useEffect, useState } from "react";
import ProjectList from "../components/projects/ProjectList";
import ProjectFilter from "../components/projects/ProjectFilter";
import Loader from "../components/common/Loader";
import { getAllProjects } from "../services/projectService";
import { setSEO } from "../utils/seo";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSEO({
      title: "Projects | Bhavesh Patil - Full Stack Developer",
      description:
        "Explore real-world MERN stack projects by Bhavesh Patil, including full stack apps, dashboards, APIs, and SaaS platforms.",
      keywords:
        "Projects, Portfolio, MERN Stack, Full Stack Developer, React Projects, Node.js, MongoDB",
    });
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        setProjects(data);
        setFilteredProjects(data);
        setCategories(
          Array.from(new Set(data.map((p) => p.category).filter(Boolean)))
        );
        setTechnologies(
          Array.from(
            new Set(
              data
                .flatMap((p) => p.technologies || [])
                .map((t) => t.trim())
                .filter(Boolean)
            )
          )
        );
      } catch (err) {
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleFilterChange = (filters) => {
    let filtered = [...projects];

    if (filters.technology) {
      filtered = filtered.filter((project) =>
        project.technologies?.includes(filters.technology)
      );
    }

    if (filters.category) {
      filtered = filtered.filter((project) => project.category === filters.category);
    }

    setFilteredProjects(filtered);
  };

  if (loading) return <Loader text="Loading projects..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Projects</h1>
        <p className="text-gray-600 dark:text-gray-400">
          A curated collection of my best work across frontend, backend, and full stack development.
        </p>
      </div>

      <ProjectFilter
        onFilterChange={handleFilterChange}
        categories={categories}
        technologies={technologies}
      />
      <ProjectList projects={filteredProjects} />
    </div>
  );
};

export default Projects;
