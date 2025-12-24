"use client";

import Link from "next/link";
import useProducts from "../ApiFetch"; // correct import

import { ProductGridSkeleton } from "@/components/ui/Skeletons";

const ProductList = () => {
    const { products, error, loading } = useProducts();

    if (loading) {
        return (
            <div className="bg-[#f5f5f5] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center mb-10">
                        <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-md" />
                    </div>
                    <ProductGridSkeleton count={8} />
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[50vh] bg-[#f5f5f5]">
                <p className="text-xl font-medium text-red-500">Error loading products. Please try again later.</p>
            </div>
        );
    }

    return (
        <section className="bg-[#f5f5f5] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#333]">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 tracking-tight">Featured Products</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {products.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-[12px] shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] p-4 flex flex-col h-full border border-gray-100"
                        >
                            <div className="relative h-48 w-full mb-4 flex items-center justify-center overflow-hidden  rounded-md">
                                {/* Using standard img tag since Next.js Image requires domain config for external URLs */}
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="object-contain h-full w-full max-h-44 rounded-xl"
                                />
                                {item.stock === 0 ? (
                                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                                        <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Out of Stock</span>
                                    </div>
                                ) : item.stock <= 5 ? (
                                    <span className="absolute bottom-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider z-10 animate-pulse">
                                        Almost sold out
                                    </span>
                                ) : null}
                            </div>


                            <div className="flex flex-col flex-grow">
                                <h3 className="text-base font-bold leading-snug mb-2 line-clamp-2 min-h-[2.5rem]" title={item.title}>
                                    {item.title}
                                </h3>

                                <p className="text-sm text-gray-500 mb-3 line-clamp-3 leading-relaxed flex-grow">
                                    {item.description}
                                </p>

                                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900">
                                        ${item.price.toFixed(2)}
                                    </span>
                                    <Link href={`/product/${item.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductList;
