"use client";
import { useState } from "react";
import { useStore } from "../../store";
import { createOrder } from "../../services/orderService";
import { useRouter } from "next/navigation";

export default function Checkout() {
    const { cart, user } = useStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    if (!user) {
        return router.push("/login"); // Should wrap in effect, but for simplicity
    }

    if (cart.length === 0 && !success) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Your cart is empty.</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Order Placed Successfully!</h2>
                <p className="text-gray-600">Thank you for your purchase.</p>
                <button
                    onClick={() => router.push("/")}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    const totalAmount = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const products = cart.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
            }));

            await createOrder({
                products,
                totalAmount,
                shippingAddress: {
                    address,
                    city,
                    zip,
                },
            });

            setSuccess(true);
            // Cart will be cleared on next fetch or we can force reload, 
            // but store normally syncs on mount. 
            // Ideally we clear local cart state here too via refetch or manual clear.
            // window.location.reload(); or similar. 
            // Since backend clears it, next getCart will be empty.
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            {cart.map(item => (
                                <div key={item.product._id} className="flex justify-between text-sm">
                                    <span className="text-gray-600">{item.product.title} (x{item.quantity})</span>
                                    <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handlePlaceOrder} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={zip}
                                    onChange={(e) => setZip(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-1'}`}
                        >
                            {loading ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
