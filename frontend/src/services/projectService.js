import api from "./api";

const PROJECT_ENDPOINT = "/projects";

/**
 * Get all projects (public)
 */
export const getAllProjects = async (params = {}) => {
  const response = await api.get(PROJECT_ENDPOINT, { params });
  return response.data;
};

/**
 * Get single project by ID or slug (public)
 */
export const getProjectById = async (id) => {
  const response = await api.get(`${PROJECT_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Create new project (admin only)
 */
export const createProject = async (projectData) => {
  const response = await api.post(PROJECT_ENDPOINT, projectData);
  return response.data;
};

/**
 * Update project by ID (admin only)
 */
export const updateProject = async (id, projectData) => {
  const response = await api.put(`${PROJECT_ENDPOINT}/${id}`, projectData);
  return response.data;
};

/**
 * Delete project by ID (admin only)
 */
export const deleteProject = async (id) => {
  const response = await api.delete(`${PROJECT_ENDPOINT}/${id}`);
  return response.data;
};
