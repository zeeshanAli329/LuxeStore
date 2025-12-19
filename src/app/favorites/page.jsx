"use client";
import { useEffect } from "react";
import { useStore } from "@/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPKR } from "@/utils/currency";

export default function FavoritesPage() {
    const { favorites, user, toggleFavorite, loading } = useStore();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login?next=/favorites");
        }
    }, [user, loading, router]);

    if (loading) return <div className="min-h-screen pt-20 text-center">Loading favorites...</div>;
    if (!user) return null; // Logic handled in effect

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorites</h1>

                {favorites.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-lg mb-6">You haven't saved any items yet.</p>
                        <Link href="/shop" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer">
                            Browse Shop
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {favorites.map((product, idx) => {
                            // Safecheck if populate worked, sometimes it might be null if product deleted
                            if (!product || !product.title) return null;
                            return (
                                <div key={product._id || idx} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group relative flex flex-col h-full">
                                    <Link href={`/product/${product._id}`} className="block h-64 relative cursor-pointer">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </Link>

                                    <button
                                        onClick={() => toggleFavorite(product)}
                                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors text-red-500 cursor-pointer z-10"
                                        title="Remove from favorites"
                                    >
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    <div className="p-4 flex flex-col flex-1">
                                        <p className="text-xs text-gray-500 uppercase mb-1">{product.category}</p>
                                        <h3 className="text-gray-900 font-bold text-sm mb-2 line-clamp-1">
                                            <Link href={`/product/${product._id}`} className="hover:text-blue-600 cursor-pointer">
                                                {product.title}
                                            </Link>
                                        </h3>
                                        <div className="mt-auto flex justify-between items-center">
                                            <span className="font-bold text-gray-900">{formatPKR(product.newPrice || product.price)}</span>
                                            <Link href={`/product/${product._id}`} className="text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
