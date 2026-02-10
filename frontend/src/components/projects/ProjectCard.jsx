import { Link } from "react-router-dom";
import Button from "../common/Button";

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
      {/* Image */}
      {(project.thumbnail?.url || project.thumbnail) && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={project.thumbnail?.url || project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {project.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack */}
        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex items-center justify-between gap-3">
          <Link to={`/projects/${project.slug || project._id}`}>
            <Button size="sm" variant="secondary">
              Details
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm">Live</Button>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" variant="outline">
                  Code
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
