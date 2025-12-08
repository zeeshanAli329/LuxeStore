"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ShopPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [priceRange, setPriceRange] = useState(500);

    useEffect(() => {
        fetch("https://fakestoreapi.com/products")
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    const categories = ["All", "men's clothing", "women's clothing", "electronics", "jewelery"];

    const filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
        const priceMatch = product.price <= priceRange;
        return categoryMatch && priceMatch;
    });

    return (
        <div className="min-h-screen bg-[#f5f5f5] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Filters</h3>

                            {/* Categories */}
                            <div className="mb-8">
                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Categories</h4>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <label key={cat} className="flex items-center cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="category"
                                                className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                checked={selectedCategory === cat}
                                                onChange={() => setSelectedCategory(cat)}
                                            />
                                            <span className="ml-3 text-gray-600 group-hover:text-blue-600 capitalize transition-colors">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Price Range</h4>
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between mt-2 text-sm text-gray-600">
                                    <span>$0</span>
                                    <span className="font-medium text-gray-900">${priceRange}</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="mb-6 flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Shop All Products</h1>
                            <span className="text-gray-500">{filteredProducts.length} results</span>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl h-96 animate-pulse"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] p-4 flex flex-col h-full border border-gray-100 group"
                                    >
                                        <div className="relative h-48 w-full mb-4 flex items-center justify-center overflow-hidden bg-white rounded-lg">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="object-contain h-full w-full max-h-40 group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>

                                        <div className="flex flex-col flex-grow">
                                            <p className="text-xs text-gray-500 uppercase mb-1">{item.category}</p>
                                            <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-2" title={item.title}>
                                                {item.title}
                                            </h3>

                                            <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                                                <span className="text-lg font-bold text-gray-900">
                                                    ${item.price.toFixed(2)}
                                                </span>
                                                <Link href={`/product/${item.id}`} className="p-2 bg-gray-100 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
