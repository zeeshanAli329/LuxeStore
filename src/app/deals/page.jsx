"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { formatPKR } from "@/utils/currency";
import { formatDateTime } from "@/utils/dateUtils";
import SaleBanner from "@/components/SaleBanner";

export default function DealsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const res = await api.get("/products/deals");
                setProducts(res.data);
            } catch (error) {
                console.error("Failed to load deals", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDeals();
    }, []);

    if (loading) return (
        <div className="min-h-screen p-8 text-center text-gray-500 bg-white">
            <h1 className="text-3xl font-bold mb-8">Exclusive Deals</h1>
            Loading great offers...
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-12">

            {/* SALE BANNER */}
            <SaleBanner deals={products} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-xl text-gray-400 mb-6">No active deals right now.</p>
                        <Link href="/shop" className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ProductCard({ product }) {
    if (!product) return null;
    return (
        <Link href={`/product/${product._id}`} className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full relative">
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                {/* Badges - NO DEAL BADGE */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
                    {product.isOnSale && (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wide">
                            {product.saleLabel || "SALE"}
                        </span>
                    )}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="mb-2">
                    <h3 className="font-bold text-gray-900 line-clamp-1 text-lg group-hover:text-blue-600 transition-colors">{product.title}</h3>
                    <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                </div>

                {/* Sale End Time Only */}
                {(product.isOnSale && product.saleEndsAt) ? (
                    <div className="mb-3 text-[11px] text-gray-500 border-t border-gray-100 pt-2">
                        <p className="text-red-500 font-bold">Sale ends: {formatDateTime(product.saleEndsAt)}</p>
                    </div>
                ) : null}

                <div className="mt-auto flex items-end justify-between">
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{formatPKR(product.newPrice || product.price)}</p>
                        {product.oldPrice && (
                            <p className="text-sm text-gray-400 line-through">{formatPKR(product.oldPrice)}</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
