/**
 * Reusable Auth Header Helper
 * Safely retrieves the JWT token from localStorage and returns the Bearer header object.
 */
export const getAuthHeader = () => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            return { Authorization: `Bearer ${token}` };
        }
    }
    return {};
};
