/**
 * API Configuration
 * Supports Local and Proxy-based Production environments
 */

const getApiBaseUrl = () => {
    // For production, use the environment variable
    if (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
        return process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
    }

    // Local Development Fallback
    return "http://localhost:5000/api";
};

export const API_BASE = getApiBaseUrl();

// Log the computed base URL once
if (typeof window !== "undefined") {
    console.log(`[API Client] Setting baseURL to: ${API_BASE}`);
}
