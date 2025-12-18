"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/store";


export default function DetailsPage({ id }) {
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useStore();
    const router = useRouter();

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
        });

        router.push("/cart");
    };


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch current product details
                const productRes = await fetch(`https://fakestoreapi.com/products/${id}`);
                if (!productRes.ok) throw new Error("Product not found");
                const productData = await productRes.json();
                setProduct(productData);

                // Fetch related products based on category
                const relatedRes = await fetch(`https://fakestoreapi.com/products/category/${productData.category}`);
                const relatedData = await relatedRes.json();

                // Filter out the current product from related list
                const filteredRelated = relatedData.filter(item => item.id !== parseInt(id));
                setRelatedProducts(filteredRelated);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f5f5f5]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f5f5f5]">
                <p className="text-xl text-red-500 font-medium">Error: {error}</p>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-[#f5f5f5] py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#333]">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-8 text-sm text-gray-500">
                    <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
                    <span className="mx-2">/</span>
                    <span className="capitalize">{product.category}</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium truncate">{product.title}</span>
                </nav>

                {/* Product Details Section */}
                <div className="bg-white rounded-[20px] shadow-sm overflow-hidden mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-8 lg:p-12">
                        {/* Image Column */}
                        <div className="flex items-center justify-center bg-white p-6 rounded-xl">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="object-contain max-h-[400px] w-full hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Info Column */}
                        <div className="flex flex-col justify-center">
                            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full w-fit mb-4">
                                {product.category}
                            </span>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                {product.title}
                            </h1>

                            <div className="flex items-center mb-6">
                                <div className="flex items-center text-yellow-400 mr-2">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-5 h-5 ${i < Math.round(product.rating.rate) ? 'fill-current' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">({product.rating.count} reviews)</span>
                            </div>

                            <p className="text-4xl font-bold text-gray-900 mb-6">
                                ${product.price.toFixed(2)}
                            </p>

                            <p className="text-gray-600 text-lg leading-relaxed mb-8 border-b border-gray-100 pb-8">
                                {product.description}
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-gray-900 text-white px-8 py-4 cursor-pointer rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                                >
                                    Add to Cart
                                </button>

                                <button className="px-4 py-4 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-gray-900 transition-colors">
                                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((item) => (
                                <Link href={`/product/${item.id}`} key={item.id} className="group">
                                    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col border border-gray-100">
                                        <div className="relative h-48 mb-4 flex items-center justify-center overflow-hidden bg-white rounded-lg">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="object-contain h-full w-full max-h-40 group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="flex flex-col flex-grow">
                                            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                                                {item.title}
                                            </h3>
                                            <div className="mt-auto pt-2 flex items-center justify-between">
                                                <span className="text-base font-bold text-gray-900">
                                                    ${item.price.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
