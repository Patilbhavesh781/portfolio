import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

/**
 * Custom hook for fetching data from API endpoints.
 * @param {string} url - API endpoint
 * @param {object} options - Axios config options
 */
const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!url);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (overrideUrl = url, overrideOptions = options) => {
      if (!overrideUrl) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(overrideUrl, overrideOptions);
        setData(response.data);
        return response.data;
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong while fetching data.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData,
  };
};

export default useFetch;
