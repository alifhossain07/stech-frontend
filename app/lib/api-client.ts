import axios from "axios";

/**
 * Axios instance configured to automatically include Bearer token from localStorage
 * when making API requests to Next.js API routes
 */
const apiClient = axios.create({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Authorization header if token exists
apiClient.interceptors.request.use(
  (config) => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("sannai_auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

