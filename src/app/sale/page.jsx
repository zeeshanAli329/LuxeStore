"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { formatPKR } from "@/utils/currency"; // Assuming this utility exists based on HomeClient
import { ProductGridSkeleton } from "@/components/ui/Skeletons"; // Assuming reuse

export default function SalePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSaleProducts = async () => {
            try {
                const res = await api.get("/products/sale");
                setProducts(res.data);
            } catch (error) {
                console.error("Failed to load sale products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSaleProducts();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Exclusive Offers</h1>
                <ProductGridSkeleton count={8} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Exclusive Offers</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">Grab these limited-time deals before they're gone!</p>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <SaleProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h2 className="text-xl text-gray-600">No active sales at the moment.</h2>
                        <Link href="/shop" className="mt-4 inline-block text-blue-600 hover:underline">
                            Browse all products
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function SaleProductCard({ product }) {
    return (
        <Link href={`/product/${product._id}`} className="group block w-full h-full cursor-pointer bg-white rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden">
            <div className="w-full h-56 bg-gray-200 relative">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-center object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.isOnSale && (
                    <div className="absolute top-2 left-2 z-10">
                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wide">
                            {product.saleLabel || "SALE"}
                        </span>
                    </div>
                )}
                {!product.isOnSale && product.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                        -{product.discount}%
                    </span>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                    <h3 className="text-sm text-gray-700 font-medium line-clamp-1">{product.title}</h3>
                    <p className="mt-1 text-xs text-gray-400 capitalize">{product.category}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-col">
                        <p className="text-lg font-bold text-red-600">{formatPKR(product.newPrice)}</p>
                        {product.oldPrice && (
                            <p className="text-xs line-through text-gray-400">{formatPKR(product.oldPrice)}</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
