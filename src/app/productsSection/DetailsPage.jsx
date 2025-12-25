"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/store";
import { getProductById } from "../../services/productService";
import { DetailsSkeleton } from "@/components/ui/Skeletons";
import ProductGallery from "@/components/ProductGallery";

export default function DetailsPage({ id }) {
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart, favorites, toggleFavorite, user } = useStore();
    const router = useRouter();
    const isFavorite = (favorites || []).some(fav => (fav._id || fav) === (product?._id || product?.id));

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [validationError, setValidationError] = useState("");

    const handleAddToCart = () => {
        if (!product) return;

        // Validation
        if (product.sizes?.length > 0 && !selectedSize) {
            setValidationError("Please select a size");
            return;
        }
        if (product.colors?.length > 0 && !selectedColor) {
            setValidationError("Please select a color");
            return;
        }

        setValidationError("");
        addToCart(product, 1, selectedSize, selectedColor);
        router.push("/cart");
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const productData = await getProductById(id);
                setProduct(productData);
                setRelatedProducts([]);
            } catch (err) {
                setError(err.message || "Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) {
        return <DetailsSkeleton />;
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
                        <div className="relative">
                            {product.discount > 0 && (
                                <span className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                                    -{product.discount}%
                                </span>
                            )}
                            <ProductGallery
                                mainImage={product.image}
                                additionalImages={product.images}
                                video={product.video}
                                title={product.title}
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

                            <div className="flex items-center gap-4 mb-6">
                                <p className="text-4xl font-bold text-gray-900">
                                    Rs.{product.newPrice?.toFixed(0)}
                                </p>
                                {product.oldPrice && product.oldPrice > product.newPrice && (
                                    <p className="text-xl text-gray-400 line-through">
                                        Rs.{product.oldPrice.toFixed(2)}
                                    </p>
                                )}
                            </div>

                            <p className="text-gray-600 text-lg leading-relaxed mb-6 border-b border-gray-100 pb-6">
                                {product.description}
                            </p>

                            {/* Stock Indicator */}
                            <div className="mb-6">
                                {product.stock === 0 ? (
                                    <span className="text-red-600 font-bold flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                        Out of stock
                                    </span>
                                ) : product.stock <= 5 ? (
                                    <span className="text-orange-500 font-bold flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                                        Almost sold out! Only {product.stock} left
                                    </span>
                                ) : (
                                    <span className="text-green-600 font-medium flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                        In Stock ({product.stock} available)
                                    </span>
                                )}
                            </div>

                            {/* Variant Selectors */}
                            <div className="space-y-6 mb-8">
                                {product.colors?.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Color</label>
                                        <div className="flex flex-wrap gap-2">
                                            {product.colors.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${selectedColor === color
                                                        ? 'border-gray-900 bg-gray-900 text-white'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                                                        }`}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {product.sizes?.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Size</label>
                                        <div className="flex flex-wrap gap-2">
                                            {product.sizes.map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${selectedSize === size
                                                        ? 'border-gray-900 bg-gray-900 text-white'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {validationError && (
                                <p className="text-red-500 text-sm font-medium mb-4 animate-bounce">
                                    ⚠️ {validationError}
                                </p>
                            )}

                            <div className="flex gap-4 flex-col sm:flex-row">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className={`flex-1 px-8 py-4 cursor-pointer rounded-xl font-semibold text-lg transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl ${product.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                                >
                                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                </button>

                                <button
                                    onClick={() => {
                                        if (!product) return;
                                        if (product.sizes?.length > 0 && !selectedSize) {
                                            setValidationError("Please select a size");
                                            return;
                                        }
                                        if (product.colors?.length > 0 && !selectedColor) {
                                            setValidationError("Please select a color");
                                            return;
                                        }
                                        router.push(`/buy-now?productId=${product._id || product.id}&qty=1${selectedSize ? `&size=${selectedSize}` : ''}${selectedColor ? `&color=${selectedColor}` : ''}`);
                                    }}
                                    disabled={product.stock === 0}
                                    className={`flex-1 px-8 py-4 cursor-pointer rounded-xl font-semibold text-lg transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl ${product.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                >
                                    Buy Now
                                </button>

                                <button
                                    onClick={() => toggleFavorite(product)}
                                    className={`px-4 py-4 rounded-xl border-2 transition-all flex items-center justify-center cursor-pointer ${isFavorite
                                        ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100'
                                        : 'border-gray-200 text-gray-400 hover:border-red-500 hover:text-red-500'
                                        }`}
                                >
                                    <svg className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
