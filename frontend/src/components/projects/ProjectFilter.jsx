import { useState } from "react";

const ProjectFilter = ({ onFilterChange, categories = [], technologies = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTech, setSelectedTech] = useState("all");

  const handleFilterChange = (category, tech) => {
    const filter = {
      category: category !== "all" ? category : undefined,
      technology: tech !== "all" ? tech : undefined,
    };
    onFilterChange(filter);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    handleFilterChange(value, selectedTech);
  };

  const handleTechChange = (e) => {
    const value = e.target.value;
    setSelectedTech(value);
    handleFilterChange(selectedCategory, value);
  };

  return (
    <div className="mb-10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Technology Filter */}
        <select
          value={selectedTech}
          onChange={handleTechChange}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Technologies</option>
          {technologies.map((tech, index) => (
            <option key={index} value={tech}>
              {tech}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProjectFilter;
