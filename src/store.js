"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getProfile, logout as performLogout } from "./services/authService";
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, getFavorites, addToFavorites as apiAddToFavorites, removeFromFavorites as apiRemoveFromFavorites } from "./services/cartService";

const StoreContext = createContext();

export function StoreProvider({ children }) {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Load - Check Auth
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    // Fetch latest profile to get role
                    const userData = await getProfile();
                    // userData must include { role, ... }
                    setUser(userData);

                    const serverCart = await getCart();
                    const serverFavs = await getFavorites();

                    setCart(serverCart);
                    setFavorites(serverFavs);
                } catch (err) {
                    console.error("Auth check failed", err);
                    localStorage.removeItem("token");
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem("token", token);
        setUser(userData);
        setCart(userData.cart || []);
        setFavorites(userData.favorites || []);
    };

    const logout = () => {
        performLogout();
        setUser(null);
        setCart([]);
        setFavorites([]);
        window.location.href = "/login";
    };

    const addToCart = async (product, quantity = 1) => {
        if (!user) {
            // Local logic for Guest (optional: redirect to login)
            return window.location.href = "/login";
        }

        try {
            const updatedCart = await apiAddToCart(product._id || product.id, quantity);
            setCart(updatedCart);
        } catch (err) {
            console.error("Add to cart failed", err);
        }
    };

    const removeFromCart = async (productId) => {
        if (!user) return;
        try {
            const updatedCart = await apiRemoveFromCart(productId);
            setCart(updatedCart);
        } catch (err) {
            console.error("Remove from cart failed", err);
        }
    };

    const addToFavorites = async (product) => {
        if (!user) return window.location.href = "/login";
        try {
            // Backend expects productId
            const updatedFavs = await apiAddToFavorites(product._id || product.id);
            setFavorites(updatedFavs);
        } catch (err) {
            console.error("Add to fav failed", err);
        }
    };

    const removeFromFavorites = async (productId) => {
        if (!user) return;
        try {
            const updatedFavs = await apiRemoveFromFavorites(productId);
            setFavorites(updatedFavs);
        } catch (err) {
            console.error("Remove from fav failed", err);
        }
    };

    return (
        <StoreContext.Provider value={{
            user,
            cart,
            favorites,
            loading,
            login,
            logout,
            addToCart,
            removeFromCart,
            addToFavorites,
            removeFromFavorites
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStore = () => useContext(StoreContext);
