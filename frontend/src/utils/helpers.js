/**
 * Format a date string into a readable format
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
};

/**
 * Truncate text to a specific length
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

/**
 * Capitalize the first letter of a string
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert array to comma-separated string
 */
export const arrayToString = (arr) => {
  if (!Array.isArray(arr)) return "";
  return arr.join(", ");
};

/**
 * Convert comma-separated string to array
 */
export const stringToArray = (str) => {
  if (!str) return [];
  return str
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};
