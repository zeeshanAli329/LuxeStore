"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/store";
import { getProductById } from "../../services/productService";
import { DetailsSkeleton } from "@/components/ui/Skeletons";
import ProductGallery from "@/components/ProductGallery";
import BoutiqueBookingModal from "./BoutiqueBookingModal";
import { getProducts } from "../../services/productService";
import { formatPKR } from "@/utils/currency";
import { formatDateTime } from "@/utils/dateUtils";
import FreeHomeDeliveryBanner from "@/components/FreeHomeDeliveryBanner";


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
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);


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

                // Fetch related products
                if (productData.category === "Boutique" || productData.isBoutique) {
                    const allProducts = await getProducts();
                    const boutiqueRelated = allProducts.filter(p =>
                        (p.category === "Boutique" || p.isBoutique) && p._id !== id
                    ).slice(0, 8);
                    setRelatedProducts(boutiqueRelated);
                } else {
                    setRelatedProducts([]);
                }

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

        <div className="min-h-screen bg-[#f5f5f5] py-2 px-2 sm:px-4 lg:px-8 font-sans text-[#333]">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-2 text-[10px] text-gray-500 flex items-center whitespace-nowrap overflow-hidden w-full">
                    <Link href="/" className="hover:text-gray-900 transition-colors shrink-0">Home</Link>
                    <span className="mx-1">/</span>
                    <span className="capitalize shrink-0">{product.category}</span>
                    <span className="mx-1">/</span>
                    <span className="text-gray-900 font-medium truncate block min-w-0 flex-1">{product.title}</span>
                </nav>
                <div className="mb-4">
                    <FreeHomeDeliveryBanner />
                </div>

                {/* Product Details Section */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4 p-0 md:p-6">
                        {/* Image Column */}
                        <div className="relative p-0 md:p-0">
                            {product.isDeal && (
                                <span className="absolute top-2 left-2 z-10 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-md uppercase tracking-wide">
                                    {product.dealLabel || "DEAL"}
                                </span>
                            )}
                            {product.isOnSale && (
                                <span className={`absolute ${product.isDeal ? 'top-10' : 'top-2'} left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md uppercase tracking-wide`}>
                                    {product.saleLabel || "SALE"}
                                </span>
                            )}
                            {!product.isOnSale && !product.isDeal && product.discount > 0 && (
                                <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
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
                        <div className="flex flex-col justify-center p-4 md:p-0">
                            <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full w-fit mb-1.5">
                                {product.category}
                            </span>

                            <h1 className="text-xl font-bold text-gray-900 mb-1.5 leading-tight">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-6 mb-3">
                                <p className="text-xl font-bold text-blue-500">
                                    Rs.  {product.newPrice?.toFixed(0)}
                                </p>

                                {product.oldPrice && product.oldPrice > product.newPrice && (
                                    <p className="text-sm text-red-400 line-through">
                                        Rs. {product.oldPrice.toFixed(0)}
                                    </p>
                                )}
                            </div>

                            {/* Deal & Sale Info */}
                            {(product.dealNote || (product.isDeal && product.dealEndsAt) || (product.isOnSale && product.saleEndsAt)) && (
                                <div className="mb-4 bg-gray-50 border border-gray-100 rounded-lg p-3">
                                    {product.dealNote && (
                                        <p className="text-sm font-semibold text-yellow-800 mb-1">
                                            🌟 {product.dealNote}
                                        </p>
                                    )}
                                    {product.isDeal && product.dealEndsAt && (
                                        <p className="text-xs font-medium text-gray-500">
                                            Deal ends: <span className="text-yellow-700">{formatDateTime(product.dealEndsAt)}</span>
                                        </p>
                                    )}
                                    {product.isOnSale && product.saleEndsAt && !product.isDeal && (
                                        <p className="text-xs font-medium text-gray-500">
                                            Sale ends: <span className="text-red-600">{formatDateTime(product.saleEndsAt)}</span>
                                        </p>
                                    )}
                                </div>
                            )}

                            <p className="text-gray-600 text-xs leading-relaxed mb-3 border-b border-gray-100 pb-3">
                                {product.description}
                            </p>

                            {/* Boutique Info */}
                            {(product.category === "Boutique" || product.isBoutique) && (
                                <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-100 rounded-md">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider leading-none">Estimated Completion</p>
                                            <p className="text-xs font-medium text-gray-900">
                                                {product.designTimeMinDays && product.designTimeMaxDays
                                                    ? `${product.designTimeMinDays}–${product.designTimeMaxDays} Business Days`
                                                    : "3–7 Business Days"}
                                            </p>
                                        </div>
                                    </div>

                                    {product.visitLocationText && (
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-blue-100 rounded-md shrink-0">
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider leading-none">Visit Location</p>
                                                    <p className="text-xs font-medium text-gray-900 mt-0.5">{product.visitLocationText}</p>
                                                    {product.visitLocationMapUrl && (
                                                        <a href={product.visitLocationMapUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-700 font-bold underline hover:text-blue-800 transition-colors mt-0.5 inline-block">
                                                            Open in Google Maps
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Google Maps Embed - Only if URL supports embedding */}
                                            {product.visitLocationMapUrl && product.visitLocationMapUrl.includes("google.com/maps/embed") && (
                                                <div className="w-full h-[240px] lg:h-[320px] rounded-xl overflow-hidden border border-gray-200 shadow-sm mt-1">
                                                    <iframe
                                                        src={product.visitLocationMapUrl}
                                                        width="100%"
                                                        height="100%"
                                                        style={{ border: 0 }}
                                                        allowFullScreen=""
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                        title="Boutique Location"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}




                            {/* Variant Selectors */}
                            <div className="space-y-4 mb-6">
                                {product.colors?.length > 0 && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">Color</label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {product.colors.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all cursor-pointer ${selectedColor === color
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
                                        <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">Size</label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {product.sizes.map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all cursor-pointer ${selectedSize === size
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
                                <p className="text-red-500 text-xs font-medium mb-3 animate-bounce">
                                    ⚠️ {validationError}
                                </p>
                            )}

                            <div className="flex gap-3 flex-col sm:flex-row">
                                {(product.category === "Boutique" || product.isBoutique) ? (
                                    (() => {
                                        const hasLocation = Boolean(
                                            (product.visitLocationText && product.visitLocationText.trim()) ||
                                            (product.visitLocationMapUrl && product.visitLocationMapUrl.trim())
                                        );

                                        if (hasLocation) {
                                            return (
                                                <div className="flex gap-2 flex-1">
                                                    <button
                                                        onClick={() => setIsBookingModalOpen(true)}
                                                        className="flex-1 px-4 py-3 cursor-pointer rounded-lg font-bold text-sm lg:text-base transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg bg-blue-600 text-white hover:bg-blue-700"
                                                    >
                                                        Book Now
                                                    </button>
                                                    {product.visitLocationMapUrl && (
                                                        <a
                                                            href={product.visitLocationMapUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex-1 flex items-center justify-center px-4 py-3 cursor-pointer rounded-lg font-bold text-sm lg:text-base transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg bg-gray-900 text-white hover:bg-gray-800 text-center"
                                                        >
                                                            Visit Place
                                                        </a>
                                                    )}
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <button
                                                    onClick={() => setIsBookingModalOpen(true)}
                                                    className="flex-1 px-6 py-3 cursor-pointer rounded-lg font-bold text-base transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg bg-blue-600 text-white hover:bg-blue-700"
                                                >
                                                    Book this Design
                                                </button>
                                            );
                                        }
                                    })()
                                ) : (
                                    <>
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={product.stock === 0}
                                            className={`flex-1 px-6 py-3 cursor-pointer rounded-lg font-semibold text-base transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg ${product.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
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
                                            className={`flex-1 px-6 py-3 cursor-pointer rounded-lg font-semibold text-base transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg ${product.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                        >
                                            Buy Now
                                        </button>
                                    </>
                                )}


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

                {/* More Boutique Items */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">More Boutique Items</h2>
                                <p className="text-gray-500 italic">Curated custom designs just for you</p>
                            </div>
                            <Link href="/boutique" className="text-blue-600 font-bold hover:underline mb-1">View All</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProducts.map(item => (
                                <Link key={item._id} href={`/product/${item._id}`} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
                                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 truncate text-sm mb-1">{item.title}</h3>
                                        <p className="text-blue-600 font-extrabold text-sm">{formatPKR(item.newPrice || item.price)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <BoutiqueBookingModal
                product={product}
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
            />
        </div>
    );
}
