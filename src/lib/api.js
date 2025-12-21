import axios from "axios";
import { API_BASE } from "./config";

/**
 * Standard API Client
 * Used for all network calls in the application.
 * Favor same-origin proxy (/api) in production/non-localhost environments.
 */
const api = axios.create({
    baseURL: API_BASE,
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
            console.error("Backend unreachable (proxy/API).", {
                baseURL: error.config?.baseURL,
                url: error.config?.url,
                method: error.config?.method
            });
        }
        return Promise.reject(error);
    }
);

export default api;
