/**
 * API Configuration
 * Supports Local and Proxy-based Production environments
 */

const getApiBaseUrl = () => {
    // FORCE "/api" in production for same-origin proxying.
    // This is the most reliable way to handle mobile connectivity.
    if (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
        return "/api";
    }

    // Local Development Fallback
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
};

export const API_BASE = getApiBaseUrl();

if (typeof window !== "undefined") {
    console.log(`[API Config] Mode: ${process.env.NODE_ENV} | Base: ${API_BASE}`);
}
