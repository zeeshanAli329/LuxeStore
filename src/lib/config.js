/**
 * API Configuration
 * Supports Local and Proxy-based Production environments
 */

const getApiBaseUrl = () => {
    // FORCE "/api" in production for same-origin proxying.
    if (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
        return "/api";
    }

    // Local Development Fallback
    return "http://localhost:5000/api";
};

export const API_BASE = getApiBaseUrl();

// Log the computed base URL once
if (typeof window !== "undefined") {
    console.log(`[API Client] Setting baseURL to: ${API_BASE}`);
}
