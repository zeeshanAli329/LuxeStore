"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { formatPKR } from "@/utils/currency";
import { ProductGridSkeleton } from "@/components/ui/Skeletons";
import Skeleton from "@/components/ui/Skeleton";

export default function BoutiqueClient() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await api.get("/products");
                // Filter for Boutique category or isBoutique flag
                const boutiqueItems = res.data.filter(p => p.category === "Boutique" || p.isBoutique === true);
                setProducts(boutiqueItems);
            } catch (error) {
                console.error("Fetch boutique products failed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Skeleton className="h-10 w-64 mb-4" />
                <Skeleton className="h-4 w-48 mb-8" />
                <ProductGridSkeleton count={8} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-10 text-center ">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 ">Boutique Designs</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">Explore our exclusive custom designs. Book a design to start your custom journey.</p>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No Boutique Items Found</h3>
                    <p className="text-gray-500 mt-1">Check back later for new custom designs.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                    {products.map(product => (
                        <Link key={product._id} href={`/product/${product._id}`} className="group block w-full bg-white rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="w-full h-64 bg-gray-100 relative rounded-t-2xl overflow-hidden">
                                <img
                                    src={product.image || "https://placehold.co/400"}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {product.discount > 0 && (
                                    <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                        -{product.discount}%
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="p-5">
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">{product.category}</p>
                                <h3 className="text-base font-bold text-gray-900 truncate mb-3 group-hover:text-blue-600 transition-colors">{product.title}</h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xl font-extrabold text-gray-900">{formatPKR(product.newPrice || product.price)}</span>
                                        {product.oldPrice && (
                                            <span className="text-sm text-gray-400 line-through">{formatPKR(product.oldPrice)}</span>
                                        )}
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
