"use client";
import { useState } from "react";
import { useStore } from "../../store";
import { createOrder } from "../../services/orderService";
import { useRouter } from "next/navigation";
import { formatPKR } from "@/utils/currency";

export default function Checkout() {
    const { cart, user } = useStore();
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");
    const [error, setError] = useState("");

    if (!user) {
        // Safe redirect
        if (typeof window !== "undefined") router.push("/login?next=/checkout");
        return null;
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-medium mb-4">Your cart is empty.</p>
                    <button onClick={() => router.push("/")} className="text-blue-600 hover:underline cursor-pointer">Go Shopping</button>
                </div>
            </div>
        );
    }

    const totalAmount = cart.reduce((total, item) => {
        if (!item.product) return total; // Skip invalid
        const price = Number(item.product.newPrice || item.product.price || 0);
        const qty = Number(item.quantity || 1);
        return total + (price * qty);
    }, 0);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Filter out items with missing product data to prevent crashes
            const validItems = cart.filter(item => item.product && item.product._id);

            if (validItems.length === 0) {
                throw new Error("Cart contains invalid items. Please clear cart and try again.");
            }

            const products = validItems.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
                selectedColor: item.selectedColor,
                selectedSize: item.selectedSize,
                image: item.product.image,
                unitPrice: Number(item.product.newPrice || item.product.price || 0)
            }));

            const res = await createOrder({
                products,
                totalAmount,
                shippingAddress: {
                    address,
                    city,
                    postalCode: zip,
                    country: "Pakistan",
                    phone,
                },
            });

            // Redirect to Thank You page
            router.push(`/thank-you?orderId=${res.data._id}`);
        } catch (err) {
            console.error(err);
            console.error(err);
            // Backend sends { error: "..." } for 500s, { message: "..." } for 400s
            const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to place order";
            setError(msg);
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
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 font-medium">{item.product.title} (x{item.quantity})</span>
                                        <span className="text-xs text-gray-400">{item.selectedSize} {item.selectedColor}</span>
                                    </div>
                                    <span className="font-medium text-gray-900">{formatPKR((item.product.newPrice || item.product.price) * item.quantity)}</span>
                                </div>
                            ))}
                            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{formatPKR(totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handlePlaceOrder} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="House #, Street, Area"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    value={zip}
                                    onChange={(e) => setZip(e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Required)</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="0300 1234567"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

                        {/* Payment Method - COD Enforced */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
                            <div className="flex items-center space-x-3 p-4 border border-blue-600 bg-blue-50 rounded-lg cursor-pointer">
                                <div className="h-5 w-5 rounded-full border-[5px] border-blue-600 bg-white"></div>
                                <span className="font-medium text-gray-900">Cash on Delivery (COD)</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all cursor-pointer ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-1'}`}
                        >
                            {loading ? "Processing..." : `Place Order - ${formatPKR(totalAmount)}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
