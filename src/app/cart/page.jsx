"use client";
import { useStore } from "@/store";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { cart, removeFromCart } = useStore();
    const router = useRouter();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-medium">Your cart is empty</p>
            </div>
        );
    }

    const handleBuyNow = (item) => {
        // For now, redirect to checkout page or payment page
        router.push("/checkout"); // You can implement checkout page later
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-6">
                <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-6 border-b py-4"
                    >
                        {/* Image */}
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-20 h-20 object-contain"
                        />

                        {/* Info */}
                        <div className="flex-1">
                            <h2 className="font-semibold text-gray-900">{item.title}</h2>
                            <p className="text-gray-500 text-sm">Price: ${item.price}</p>
                            <p className="text-gray-500 text-sm">Qty: {item.qty}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => handleBuyNow(item)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                                Buy Now
                            </button>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                                Delete
                            </button>
                        </div>

                        {/* Total */}
                        <div className="font-bold">${(item.price * item.qty).toFixed(2)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
