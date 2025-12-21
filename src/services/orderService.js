import api from "../lib/api";

// Create Order
export const createOrder = async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
};

// Get My Orders
export const getMyOrders = async () => {
    const response = await api.get("/orders/myorders");
    return response.data;
};
