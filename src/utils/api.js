import axios from "axios";

// Configurable Base URL
const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
        return process.env.NEXT_PUBLIC_API_BASE_URL;
    }
    if (process.env.NODE_ENV === "production") {
        console.warn("WARNING: NEXT_PUBLIC_API_BASE_URL is not set in production! Defaulting to strict localhost (likely to fail on Vercel/Mobile).");
    }
    return "http://localhost:5000/api";
};

const baseURL = getBaseUrl();
console.log("API Client Initialized with Base URL:", baseURL);

// Create an instance of axios
const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Check if we are in the browser
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
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

export default api;
