import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Token is now handled via httpOnly cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors globally
    if (error.response) {
      if (error.response.status === 500) {
        console.error(
          "Server error. Please try again later. the error: ",
          error.response.data
        );
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again later.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
