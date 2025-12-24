"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile, logout as performLogout } from "./services/authService";
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, getFavorites, toggleFavorite as apiToggleFavorite } from "./services/cartService";

const StoreContext = createContext();

export function StoreProvider({ children }) {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); // Use router for logout

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
        router.replace("/login");
    };

    const addToCart = async (product, quantity = 1, selectedSize = null, selectedColor = null) => {
        if (!user) {
            alert("Please login to add items to cart");
            return;
        }

        try {
            const updatedCart = await apiAddToCart(product._id || product.id, quantity, selectedSize, selectedColor);
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

    const toggleFavorite = async (product) => {
        if (!user) {
            router.push("/login?next=" + window.location.pathname);
            return;
        }
        try {
            const productId = product._id || product.id;
            // API call: POST /users/favorites/:id
            // Note: cartService needs to support this or we call api directly. 
            // Let's use api directly here to ensure control or update cartService.
            // Using existing pattern implies updating cartService. I'll stick to store logic if possible.
            // But let's verify cartService methods. Assuming I update them too.
            const updatedFavs = await apiToggleFavorite(productId);
            setFavorites(updatedFavs);
        } catch (err) {
            console.error("Toggle fav failed", err);
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
            addToCart,
            removeFromCart,
            toggleFavorite
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStore = () => useContext(StoreContext);
