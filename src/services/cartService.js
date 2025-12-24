import api from "../lib/api";

// Get Cart
export const getCart = async () => {
    const response = await api.get("/users/cart");
    return response.data;
};

// Add to Cart
export const addToCart = async (productId, quantity, selectedSize = null, selectedColor = null) => {
    const response = await api.post("/users/cart", { productId, quantity, selectedSize, selectedColor });
    return response.data;
};


// Remove from Cart
export const removeFromCart = async (productId) => {
    const response = await api.delete(`/users/cart/${productId}`);
    return response.data;
};

// Get Favorites
export const getFavorites = async () => {
    const response = await api.get("/users/favorites");
    return response.data;
};

// Toggle Favorite (Replaces add/remove)
export const toggleFavorite = async (productId) => {
    // Backend: POST /users/favorites/:productId handles toggle
    const response = await api.post(`/users/favorites/${productId}`);
    return response.data;
};

// Helper for backward compatibility or direct add calls if needed elsewhere
// But prefer toggleFavorite
export const addToFavorites = async (productId) => {
    return toggleFavorite(productId);
};

export const removeFromFavorites = async (productId) => {
    // Current backend logic is toggle-based on POST, but let's check if we strictly need DELETE
    // If backend implements toggle on POST, this is fine.
    // If we want explicit remove, we might need to check if backend still has DELETE.
    // Looking at userController modification, I saw I removed explicit remove and add in favor of toggle.
    // So toggleFavorite is the only one we really need.
    return toggleFavorite(productId);
};
