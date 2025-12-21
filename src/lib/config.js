/**
 * API Configuration
 * Supports Local and Proxy-based Production environments
 */

const getApiBaseUrl = () => {
    const isProd = process.env.NODE_ENV === "production";

    if (isProd) {
        // In production, we proxy through the Vercel domain (/api)
        // This avoids CORS and mobile connectivity issues.
        return "/api";
    }

    // Fallback for local development
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
};

export const API_BASE = getApiBaseUrl();

if (typeof window !== "undefined") {
    console.log(`[API Config] Mode: ${process.env.NODE_ENV} | Base: ${API_BASE}`);
}
