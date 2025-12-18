"use client";
import { createContext, useContext, useState } from "react";

const StoreContext = createContext();

export function StoreProvider({ children }) {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart((prev) => {
            const exists = prev.find((i) => i.id === product.id);
            return exists
                ? prev.map((i) =>
                    i.id === product.id ? { ...i, qty: i.qty + 1 } : i
                )
                : [...prev, { ...product, qty: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((i) => i.id !== id));
    };

    return (
        <StoreContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStore = () => useContext(StoreContext);
