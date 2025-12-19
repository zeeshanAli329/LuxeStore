import api from "../utils/api";

// Get Cart
export const getCart = async () => {
    const response = await api.get("/users/cart");
    return response.data;
};

// Add to Cart
export const addToCart = async (productId, quantity) => {
    const response = await api.post("/users/cart", { productId, quantity });
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

// Add to Favorites
export const addToFavorites = async (productId) => {
    const response = await api.post("/users/favorites", { productId });
    return response.data;
};

// Remove from Favorites
export const removeFromFavorites = async (productId) => {
    const response = await api.delete(`/users/favorites/${productId}`);
    return response.data;
};
