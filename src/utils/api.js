import axios from "axios";

// Configurable Base URL
const getBaseUrl = () => {
    // 1. Priority: Environment Variable (Vercel/Production/Mobile)
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
        return process.env.NEXT_PUBLIC_API_BASE_URL;
    }

    // 2. Production Safety: Fail loudly if missing
    if (process.env.NODE_ENV === "production") {
        console.error("CRITICAL ERROR: NEXT_PUBLIC_API_BASE_URL is missing in production! API calls will fail.");
        // We return a dummy URL or let it fail naturally, but logging is key. 
        // Returning relative URL helps if using Next.js rewrites, but here we expect separate backend.
        // Let's assume separate backend.
        return "https://backend-not-configured.com/api";
    }

    // 3. Development Fallback (Localhost)
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
