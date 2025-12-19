"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/utils/api";
import { formatPKR } from "@/utils/currency";

function BuyNowContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const productId = searchParams.get("productId");
    const qtyParam = searchParams.get("qty");

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    // Form inputs
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");

    useEffect(() => {
        if (!productId) {
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                // We use global get product endpoint which is public
                const res = await api.get(`/products/${productId}`);
                setProduct(res.data);
            } catch (err) {
                console.error("Failed to load product", err);
                setError("Product not found");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) return <div className="min-h-screen pt-20 text-center">Loading...</div>;
    if (!product && !loading) return <div className="min-h-screen pt-20 text-center">Product not found. <button onClick={() => router.push('/')}>Go Home</button></div>;

    const quantity = Number(qtyParam) || 1;
    const price = Number(product.newPrice || product.price);
    const totalAmount = price * quantity;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError("");

        try {
            // Payload for Guest Order
            const payload = {
                products: [{
                    product: product._id,
                    quantity,
                    selectedColor: product.colors?.[0] || "Default", // Simplified for Buy Now
                    selectedSize: product.sizes?.[0] || "Default",   // Simplified for Buy Now
                    image: product.image,
                    unitPrice: price
                }],
                totalAmount,
                shippingAddress: {
                    address,
                    city,
                    postalCode: zip,
                    country: "Pakistan",
                    phone
                },
                guestInfo: {
                    name,
                    phone,
                    email: "" // Optional
                }
            };

            const res = await api.post("/orders/guest", payload);
            router.push(`/thank-you?orderId=${res.data._id}`);

        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || err.message || "Failed to place order";
            setError(msg);
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-8">Buy Now (Guest Checkout)</h1>

                    {/* Product Summary */}
                    <div className="bg-blue-50 p-4 rounded-lg mb-8 flex items-center gap-4">
                        <img src={product.image} className="w-16 h-16 object-cover rounded" alt={product.title} />
                        <div>
                            <h3 className="font-bold text-gray-900">{product.title}</h3>
                            <p className="text-sm text-gray-600">{formatPKR(price)} x {quantity}</p>
                            <p className="font-bold text-lg text-blue-700">Total: {formatPKR(totalAmount)}</p>
                        </div>
                    </div>

                    <form onSubmit={handlePlaceOrder} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Guest Info */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 outline-none" placeholder="Ali Khan" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Required)</label>
                                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 outline-none" placeholder="0300 1234567" />
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 outline-none" placeholder="House #, Street..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input type="text" required value={city} onChange={e => setCity(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                <input type="text" required value={zip} onChange={e => setZip(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>

                        {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
                            <div className="flex items-center space-x-3 p-4 border border-blue-600 bg-blue-50 rounded-lg">
                                <div className="h-5 w-5 rounded-full border-[5px] border-blue-600 bg-white"></div>
                                <span className="font-medium text-gray-900">Cash on Delivery (COD)</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all cursor-pointer ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-1'}`}
                        >
                            {processing ? "Processing..." : `Place Order - ${formatPKR(totalAmount)}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function BuyNowPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <BuyNowContent />
        </Suspense>
    );
}
