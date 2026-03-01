import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectDetails from "../components/projects/ProjectDetails";
import Loader from "../components/common/Loader";
import { getProjectById } from "../services/projectService";
import { setSEO } from "../utils/seo";

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(id);
        setProject(data);

        setSEO({
          title: `${data.title} | Bhavesh Patil - Portfolio`,
          description: data.description?.slice(0, 160),
          keywords: data.technologies?.join(", "),
        });
      } catch (err) {
        setError("Failed to load project.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <Loader text="Loading project..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!project) return null;

  return <ProjectDetails project={project} />;
};

export default ProjectPage;
