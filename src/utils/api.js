import axios from "axios";

// Configurable Base URL
// Configurable Base URL
const getBaseUrl = () => {
    // Can be set in .env.local or Vercel Env Vars
    // REQUIRED for Mobile/Vercel (Production)
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
        return process.env.NEXT_PUBLIC_API_BASE_URL;
    }

    // Fallback for local development only
    return "http://localhost:5000/api";
};

const baseURL = getBaseUrl();
console.log("API Connection:", baseURL);

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
