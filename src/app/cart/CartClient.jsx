"use client";
import { useStore } from "@/store";
import { useRouter } from "next/navigation";
import { toNumber, formatPKR } from "@/lib/money";

export default function CartClient() {
    const { cart, removeFromCart, user } = useStore();
    const router = useRouter();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <p className="text-lg font-medium">Please login to view your cart</p>
                <button
                    onClick={() => router.push("/login")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
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
            const price = toNumber(item.product?.newPrice ?? item.product?.price ?? 0);
            const qty = toNumber(item.quantity ?? 1);
            return total + (price * qty);
        }, 0);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

                <div className="space-y-4">
                    {cart.map((item) => {
                        const product = item.product;
                        if (!product) {
                            console.warn("Missing product for cart item", item);
                            return null;
                        }

                        const unitPrice = toNumber(product.newPrice ?? product.price ?? 0);
                        const qty = toNumber(item.quantity ?? 1);
                        const lineTotal = unitPrice * qty;

                        return (
                            <div
                                key={product._id}
                                className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 border-b py-4 last:border-0"
                            >
                                <div className="flex items-center gap-4 w-full sm:w-auto sm:flex-1">
                                    <img
                                        src={product.image || "/placeholder.png"}
                                        alt={product.title}
                                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-md border border-gray-100 flex-shrink-0"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <h2 className="font-semibold text-gray-900 line-clamp-2 text-sm sm:text-base">{product.title}</h2>
                                        <p className="text-gray-500 text-xs hidden sm:block">Category: {product.category}</p>
                                        {(item.selectedColor || item.selectedSize) && (
                                            <p className="text-gray-600 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                                                {item.selectedColor} {item.selectedSize}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="font-medium text-blue-600 text-sm">{formatPKR(unitPrice)}</p>
                                            <span className="text-[10px] text-gray-400 sm:hidden">x{qty}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-6">
                                    <div className="hidden sm:flex items-center gap-2">
                                        <span className="text-xs text-gray-500">Qty:</span>
                                        <span className="font-medium">{qty}</span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="font-bold text-sm sm:text-base min-w-[70px] sm:min-w-[80px] text-right">
                                            {formatPKR(lineTotal)}
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(product._id)}
                                            className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 cursor-pointer rounded-full transition-colors"
                                            title="Remove item"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-end items-center border-t pt-6 gap-4 sm:gap-6">
                    <div className="text-lg sm:text-xl font-bold text-gray-900">
                        Total: <span className="text-blue-600">{formatPKR(calculateTotal())}</span>
                    </div>
                    <button
                        onClick={() => router.push("/checkout")}
                        className="w-full sm:w-auto px-8 py-3 bg-blue-600 cursor-pointer text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
