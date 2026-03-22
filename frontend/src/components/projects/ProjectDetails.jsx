import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProjectById } from "../../services/projectService";
import Loader from "../common/Loader";
import Button from "../common/Button";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(id);
        setProject(data);
      } catch (err) {
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <Loader text="Loading project..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!project) return null;

  const galleryImages = [
    ...(project.thumbnail?.url || project.thumbnail
      ? [project.thumbnail?.url || project.thumbnail]
      : []),
    ...((project.images || [])
      .map((image) => image?.url || image)
      .filter(Boolean)),
  ].filter((url, index, arr) => arr.indexOf(url) === index);

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : null;

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/projects">
            <Button variant="secondary" size="sm">
              ← Back to Projects
            </Button>
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {project.title}
        </h1>

        {(project.startDate || project.endDate) && (
          <div className="mb-4">
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {formatDate(project.startDate) || "N/A"} - {formatDate(project.endDate) || "Present"}
            </span>
          </div>
        )}

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed whitespace-pre-line">
          {project.description}
        </p>

        {/* Image Gallery */}
        {galleryImages.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 mb-8">
            {galleryImages.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`${project.title} screenshot ${index + 1}`}
                className="w-full h-64 object-cover rounded-xl shadow"
              />
            ))}
          </div>
        )}

        {/* Tech Stack */}
        {project.technologies?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {project.features?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Key Features
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              {project.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mt-8">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="md">View Live</Button>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="md" variant="outline">
                View Code
              </Button>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectDetails;
