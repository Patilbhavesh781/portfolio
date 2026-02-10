import api from "./api";

const CONTACT_ENDPOINT = "/contact";

/**
 * Send contact message (public)
 */
export const sendContactMessage = async (messageData) => {
  const response = await api.post(CONTACT_ENDPOINT, messageData);
  return response.data;
};

/**
 * Get all contact messages (admin only)
 */
export const getAllContactMessages = async (params = {}) => {
  const response = await api.get(CONTACT_ENDPOINT, { params });
  return response.data?.data || [];
};

/**
 * Delete a contact message by ID (admin only)
 */
export const deleteContactMessage = async (id) => {
  const response = await api.delete(`${CONTACT_ENDPOINT}/${id}`);
  return response.data;
};
