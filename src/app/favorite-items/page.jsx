"use client";
import { useStore } from "../../store";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Favorites() {
    const { favorites, removeFromFavorites, user } = useStore();
    const router = useRouter();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <p className="text-lg font-medium">Please login to view your favorites</p>
                <button
                    onClick={() => router.push("/login")}
                    className="px-6 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Login
                </button>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Your wishlist is empty</h2>
                <p className="text-gray-500">Start exploring products to add them to your favorites!</p>
                <Link
                    href="/shop"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Go to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorites</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {favorites.map((product) => {
                        // Handle case where product might be null if population failed
                        if (!product) return null;

                        return (
                            <div
                                key={product._id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 border border-gray-100 flex flex-col"
                            >
                                <div className="relative h-48 w-full mb-4 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                                    <img
                                        src={product.image || "/placeholder.png"}
                                        alt={product.title}
                                        className="object-contain h-full w-full hover:scale-105 transition-transform duration-300"
                                    />
                                    <button
                                        onClick={() => removeFromFavorites(product._id)}
                                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-red-50 text-red-500 transition-colors"
                                        title="Remove from favorites"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex flex-col flex-grow">
                                    <p className="text-xs text-blue-600 font-semibold uppercase mb-1">{product.category}</p>
                                    <Link href={`/product/${product._id}`}>
                                        <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-2 hover:text-blue-600">
                                            {product.title}
                                        </h3>
                                    </Link>

                                    <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                                        <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                        <Link
                                            href={`/product/${product._id}`}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}