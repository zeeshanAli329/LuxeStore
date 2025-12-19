"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { formatPKR } from "@/utils/currency";
import api from "@/utils/api";

function ThankYouContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (orderId) {
            // Optional: Fetch order details
        }
    }, [orderId]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
                <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>

                <div className="bg-gray-50 rounded-xl p-4 mb-8">
                    <p className="text-sm text-gray-500 mb-1">Order ID</p>
                    <p className="font-mono font-bold text-gray-900 break-all">{orderId || "Pending"}</p>
                    <p className="text-xs text-blue-600 mt-2 font-medium">Cash on Delivery</p>
                    <p className="text-xs text-gray-400">You will pay upon delivery.</p>
                </div>

                <div className="space-y-3">
                    <Link href="/shop" className="block w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-transform hover:-translate-y-1 shadow-lg">
                        Shop More
                    </Link>

                    {orderId && (
                        <Link href={`/order-confirmation/${orderId}`} className="block w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                            View Order Details
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ThankYouPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ThankYouContent />
        </Suspense>
    );
}
