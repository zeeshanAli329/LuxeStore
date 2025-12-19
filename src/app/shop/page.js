"use client";
import { useEffect, useState, Suspense } from "react";
import api from "../../utils/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatPKR } from "@/utils/currency";

function ShopContent() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All");

    useEffect(() => {
        if (categoryParam) setSelectedCategory(categoryParam);
    }, [categoryParam]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await api.get("/products");
                setProducts(res.data);
            } catch (error) {
                console.error("Fetch shop products failed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

    const filteredProducts = selectedCategory === "All"
        ? products
        : products.filter(p => p.category === selectedCategory);

    if (loading) return <div className="min-h-screen pt-20 text-center">Loading shop...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shop All Products</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                    <div className="space-y-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedCategory === cat
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <span className="capitalize">{cat}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">No products found in this category.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <Link key={product._id} href={`/product/${product._id}`} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="aspect-w-1 aspect-h-1 bg-gray-200 h-64 relative">
                                        <img
                                            src={product.image || "https://placehold.co/400"}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {product.discount > 0 && (
                                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                -{product.discount}%
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <p className="text-xs text-gray-500 capitalize mb-1">{product.category}</p>
                                        <h3 className="text-sm font-bold text-gray-900 truncate mb-2">{product.title}</h3>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg font-bold text-gray-900">{formatPKR(product.newPrice || product.price)}</span>
                                            {product.oldPrice && (
                                                <span className="text-sm text-gray-400 line-through">{formatPKR(product.oldPrice)}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-20 text-center">Loading shop...</div>}>
            <ShopContent />
        </Suspense>
    );
}
