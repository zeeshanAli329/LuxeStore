import api from "../lib/api";

// Register user
export const register = async (userData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
};

// Login user
export const login = async (userData) => {
    const response = await api.post("/users/login", userData);
    if (response.data.token) {
        if (typeof window !== "undefined") {
            localStorage.setItem("token", response.data.token);
        }
    }
    return response.data;
};

// Logout user
export const logout = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
    }
};

// Get user profile
export const getProfile = async () => {
    const response = await api.get("/users/profile");
    return response.data;
};
