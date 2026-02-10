import api from "./api";

const BLOG_ENDPOINT = "/blogs";

/**
 * Get all blogs (public)
 */
export const getAllBlogs = async (params = {}) => {
  const response = await api.get(BLOG_ENDPOINT, { params });
  return response.data?.data || [];
};

/**
 * Get single blog by ID or slug (public)
 */
export const getBlogById = async (id) => {
  const response = await api.get(`${BLOG_ENDPOINT}/${id}`);
  return response.data?.data || null;
};

/**
 * Create new blog post (admin only)
 */
export const createBlog = async (blogData) => {
  const response = await api.post(BLOG_ENDPOINT, blogData);
  return response.data?.data || null;
};

/**
 * Update blog post by ID (admin only)
 */
export const updateBlog = async (id, blogData) => {
  const response = await api.put(`${BLOG_ENDPOINT}/${id}`, blogData);
  return response.data?.data || null;
};

/**
 * Delete blog post by ID (admin only)
 */
export const deleteBlog = async (id) => {
  const response = await api.delete(`${BLOG_ENDPOINT}/${id}`);
  return response.data;
};
