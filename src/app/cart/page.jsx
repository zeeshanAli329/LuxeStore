"use client";
import { useStore } from "@/store";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { cart, removeFromCart, user } = useStore();
    const router = useRouter();

    if (!user) {
        // Optionally render a message or redirect
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <p className="text-lg font-medium">Please login to view your cart</p>
                <button
                    onClick={() => router.push("/login")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Login
                </button>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-medium">Your cart is empty</p>
            </div>
        );
    }

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const price = item.product?.price || 0;
            return total + (price * item.quantity);
        }, 0).toFixed(2);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-6">
                <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

                <div className="space-y-4">
                    {cart.map((item) => {
                        const product = item.product;
                        if (!product) return null; // Skip invalid items

                        return (
                            <div
                                key={product._id}
                                className="flex items-center gap-6 border-b py-4 last:border-0"
                            >
                                {/* Image */}
                                <img
                                    src={product.image || "/placeholder.png"}
                                    alt={product.title}
                                    className="w-20 h-20 object-contain rounded-md border border-gray-100"
                                />

                                {/* Info */}
                                <div className="flex-1">
                                    <h2 className="font-semibold text-gray-900">{product.title}</h2>
                                    <p className="text-gray-500 text-sm">Category: {product.category}</p>
                                    <p className="font-medium text-blue-600 mt-1">${product.newPrice?.toFixed(2) || product.price?.toFixed(2)}</p>
                                </div>

                                {/* Quantity */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500">Qty:</span>
                                    <span className="font-medium">{item.quantity}</span>
                                </div>

                                {/* Actions */}
                                <button
                                    onClick={() => removeFromCart(product._id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Remove item"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>

                                <div className="font-bold min-w-[80px] text-right">
                                    ${(product.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Total */}
                <div className="mt-8 flex justify-end items-center border-t pt-6 gap-6">
                    <div className="text-xl font-bold text-gray-900">
                        Total: <span className="text-blue-600">${calculateTotal()}</span>
                    </div>
                    <button
                        onClick={() => router.push("/checkout")}
                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
