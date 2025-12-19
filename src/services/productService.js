import api from "../utils/api";

// Get all products
export const getProducts = async (params) => {
    const response = await api.get("/products", { params });
    return response.data;
};

// Get product by ID
export const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};
