"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utils/api";
import { formatPKR } from "@/utils/currency";

export default function OrderConfirmation() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        api.get("/orders/myorders") // In a real app, /orders/:id is better but using myorders to filter for now if endpoint missing
            .then(res => {
                // Find specific order or latest
                const found = res.data.find(o => o._id === id);
                setOrder(found);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, [id]);

    if (loading) return <div className="min-h-screen pt-20 text-center">Loading order details...</div>;
    if (!order) return <div className="min-h-screen pt-20 text-center">Order not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
                <div className="text-center mb-10">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
                    <p className="mt-2 text-gray-500">Order ID: #{order._id}</p>
                </div>

                <div className="border-t border-gray-100 py-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Order Details</h2>
                    <div className="space-y-4">
                        {order.products.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {item.product?.title || "Product"} x {item.quantity}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {item.selectedSize ? `Size: ${item.selectedSize}, ` : ""}
                                        {item.selectedColor ? `Color: ${item.selectedColor}` : ""}
                                    </p>
                                </div>
                                <p className="font-medium text-gray-900">{formatPKR((item.unitPrice || 0) * item.quantity)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-100 py-6">
                    <div className="flex justify-between font-bold text-xl text-gray-900">
                        <span>Total</span>
                        <span>{formatPKR(order.totalAmount)}</span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-gray-500">
                        <span>Payment Method</span>
                        <span>{order.paymentMethod} ({order.paymentStatus})</span>
                    </div>
                </div>

                <div className="border-t border-gray-100 py-6">
                    <h3 className="font-bold text-gray-900 mb-2">Delivery To:</h3>
                    <p className="text-gray-600">{order.shippingAddress?.address}</p>
                    <p className="text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                    <p className="text-gray-600 font-medium">Phone: {order.shippingAddress?.phone}</p>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors cursor-pointer">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
