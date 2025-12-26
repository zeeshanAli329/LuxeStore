"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        oldPrice: "",
        newPrice: "",
        discount: "",
        category: "electronics",
        stock: 10,
        isFeatured: false,
        colors: "", // Comma separated
        sizes: "",   // Comma separated
        images: "",  // Comma separated
        video: "",
        designTimeMinDays: "",
        designTimeMaxDays: "",
        visitLocationText: "",
        visitLocationMapUrl: ""
    });


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                oldPrice: formData.oldPrice ? Number(formData.oldPrice) : Number(formData.newPrice),
                newPrice: Number(formData.newPrice),
                stock: Number(formData.stock),
                discount: formData.discount ? Number(formData.discount) : undefined,
                colors: formData.colors.split(",").map(c => c.trim()).filter(Boolean),
                sizes: formData.sizes.split(",").map(s => s.trim()).filter(Boolean),
                images: formData.images.split(",").map(i => i.trim()).filter(Boolean),
                video: formData.video.trim(),
                price: Number(formData.newPrice),
                designTimeMinDays: formData.category === "Boutique" ? Number(formData.designTimeMinDays) : undefined,
                designTimeMaxDays: formData.category === "Boutique" ? Number(formData.designTimeMaxDays) : undefined,
                visitLocationText: formData.category === "Boutique" ? formData.visitLocationText : undefined,
                visitLocationMapUrl: formData.category === "Boutique" ? formData.visitLocationMapUrl : undefined,
                isBoutique: formData.category === "Boutique"
            };

            await api.post("/products", payload);
            router.push("/admin/products");
        } catch (error) {
            console.error(error);
            alert("Failed to create product.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                    <p className="text-sm text-gray-500 mt-1">Create a new item in your catalog</p>
                </div>
                <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-900">
                    Cancel
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">

                {/* Core Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                            type="url"
                            name="image"
                            required
                            placeholder="https://..."
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={formData.image}
                            onChange={handleChange}
                        />
                        <p className="text-xs text-gray-400 mt-1">Link to a hosted image (e.g. Unsplash, Cloudinary)</p>
                    </div>

                    <div className="md:col-span-2">
                        <textarea
                            name="description"
                            required
                            rows="4"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Image URLs</label>
                        <textarea
                            name="images"
                            placeholder="https://image1.jpg, https://image2.jpg..."
                            rows="2"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                            value={formData.images}
                            onChange={handleChange}
                        />
                        <p className="text-xs text-gray-400 mt-1">Comma separated list of hosted image URLs</p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (Optional)</label>
                        <input
                            type="url"
                            name="video"
                            placeholder="https://video.mp4"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={formData.video}
                            onChange={handleChange}
                        />
                        <p className="text-xs text-gray-400 mt-1">Link to a video file (mp4 preferred)</p>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Pricing & Stock */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Old Price</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-400">$</span>
                            <input
                                type="number"
                                name="oldPrice"
                                min="0"
                                step="0.01"
                                className="w-full pl-7 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                value={formData.oldPrice}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Price</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-400">$</span>
                            <input
                                type="number"
                                name="newPrice"
                                required
                                min="0"
                                step="0.01"
                                className="w-full pl-7 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                value={formData.newPrice}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    {formData.category !== "Boutique" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                required
                                min="0"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                value={formData.stock}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                        <input
                            type="number"
                            name="discount"
                            min="0"
                            max="100"
                            placeholder="Auto"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none bg-gray-50"
                            value={formData.discount}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Available Colors</label>
                        <input
                            type="text"
                            name="colors"
                            placeholder="Black, White, Blue"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={formData.colors}
                            onChange={handleChange}
                        />
                        <p className="text-xs text-gray-400 mt-1">Comma separated list</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Available Sizes</label>
                        <input
                            type="text"
                            name="sizes"
                            placeholder="S, M, L, XL"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={formData.sizes}
                            onChange={handleChange}
                        />
                        <p className="text-xs text-gray-400 mt-1">Comma separated list</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>

                        <select
                            name="category"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="electronics">Electronics</option>
                            <option value="jewelry">Jewelry</option>
                            <option value="men's clothing">Men's Wearing</option>
                            <option value="women's clothing">Women Wearing</option>
                            <option value="Boutique">Boutique</option>
                            <option value="others">Others</option>

                        </select>
                    </div>
                    <div className="flex items-center pt-8">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="isFeatured"
                                className="w-5 h-5 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500 cursor-pointer"
                                checked={formData.isFeatured}
                                onChange={handleChange}
                            />
                            <span className="ml-2 text-sm text-gray-900 font-medium">Mark as Featured Product</span>
                        </label>
                    </div>
                </div>

                {/* Boutique Specific Fields */}
                {formData.category === "Boutique" && (
                    <div className="p-6 bg-blue-50/50 rounded-xl border border-blue-100 space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider">Boutique Configuration</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Design Days</label>
                                <input
                                    type="number"
                                    name="designTimeMinDays"
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.designTimeMinDays}
                                    onChange={handleChange}
                                    placeholder="e.g. 3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Design Days</label>
                                <input
                                    type="number"
                                    name="designTimeMaxDays"
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.designTimeMaxDays}
                                    onChange={handleChange}
                                    placeholder="e.g. 7"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Visit Location Text</label>
                            <input
                                type="text"
                                name="visitLocationText"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.visitLocationText}
                                onChange={handleChange}
                                placeholder="e.g. Defense Colony, Phase 5, Karachi"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL (Optional)</label>
                            <input
                                type="url"
                                name="visitLocationMapUrl"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.visitLocationMapUrl}
                                onChange={handleChange}
                                placeholder="https://goo.gl/maps/..."
                            />
                        </div>
                    </div>
                )}

                <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={() => router.push("/admin/products")}
                        className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
