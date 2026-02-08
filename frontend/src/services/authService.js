import api from "./api";

const AUTH_ENDPOINT = "/auth";

/**
 * Login user
 * @param {{ email: string, password: string }} credentials
 */
export const loginUser = async (credentials) => {
  const response = await api.post(`${AUTH_ENDPOINT}/login`, credentials);
  const { token, user } = response.data;

  if (token) {
    localStorage.setItem("authToken", token);
  }
  if (user) {
    localStorage.setItem("authUser", JSON.stringify(user));
  }

  return user;
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    await api.post(`${AUTH_ENDPOINT}/logout`);
  } catch (error) {
    // Ignore server error on logout
  } finally {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  }
};

/**
 * Get currently authenticated user
 */
export const getCurrentUser = async () => {
  const token = localStorage.getItem("authToken");
  const storedUser = localStorage.getItem("authUser");

  if (!token) {
    return null;
  }

  // Try to fetch fresh user data from backend
  try {
    const response = await api.get(`${AUTH_ENDPOINT}/me`);
    const user = response.data;
    localStorage.setItem("authUser", JSON.stringify(user));
    return user;
  } catch (error) {
    // If backend fails, fallback to localStorage user
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    throw error;
  }
};
