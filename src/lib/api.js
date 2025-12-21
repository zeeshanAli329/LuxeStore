import axios from "axios";
import { API_BASE } from "./config";

/**
 * Standard API Client
 * Used for all network calls in the application.
 * Favor same-origin proxy (/api) in production/non-localhost environments.
 */
const getBaseURL = () => {
    if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        // If not localhost, we MUST use the proxy to reach the backend
        if (hostname !== "localhost" && hostname !== "127.0.0.1") {
            return "/api";
        }
    }
    return API_BASE; // Fallback to config.js logic
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor for better logging
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            console.error("Backend not reachable from this device. Using /api proxy.", {
                baseURL: error.config?.baseURL,
                url: error.config?.url,
                method: error.config?.method
            });
        }
        return Promise.reject(error);
    }
);

export default api;
