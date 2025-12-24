"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import { use } from "react";

export default function EditProductPage({ params }) {
    // Correctly unwrap params using React.use() or await depending on Next.js version expectations for Client Components.
    // In Next 15+ params is a Promise. In 14 it was an object. App Router client component handling can vary.
    // Safe bet: use `use(params)` if on very new React, or just direct access if passed as prop in older.
    // User is on Next.js 16 (from earlier logs). `params` should be awaited or unwrapped.
    // However, simplest safe way for now in standard Client Component:
    const { id } = use(params);

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        oldPrice: "",
        newPrice: "",
        discount: "",
        category: "",
        stock: 0,
        isFeatured: false,
        colors: "", // comma separated
        sizes: "",   // comma separated
        images: "", // comma separated
        video: ""
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                const p = res.data;
                setFormData({
                    title: p.title,
                    description: p.description,
                    image: p.image || "",
                    oldPrice: p.oldPrice || "",
                    newPrice: p.newPrice || p.price || "",
                    discount: p.discount || "",
                    category: p.category,
                    stock: p.stock,
                    isFeatured: p.isFeatured,
                    colors: (p.colors || []).join(", "),
                    sizes: (p.sizes || []).join(", "),
                    images: (p.images || []).join(", "),
                    video: p.video || ""
                });
            } catch (error) {
                console.error("Failed to fetch product", error);
                alert("Failed to load product");
                router.push("/admin/products");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, router]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
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
                price: Number(formData.newPrice)
            };
            await api.put(`/products/${id}`, payload);
            router.push("/admin/products");
        } catch (error) {
            console.error(error);
            alert("Failed to update product");
        } finally {
            setSubmitting(false);
        }
    };


    if (loading) return <div className="p-8 text-center text-gray-500">Loading product...</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                    <p className="text-sm text-gray-500 mt-1">Update product details</p>
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
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
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
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                            value={formData.image}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <textarea
                            name="description"
                            required
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none resize-none"
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
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none resize-none"
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
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
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
                        <input
                            type="number"
                            name="oldPrice"
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                            value={formData.oldPrice}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Price</label>
                        <input
                            type="number"
                            name="newPrice"
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                            value={formData.newPrice}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            required
                            min="0"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                            value={formData.stock}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                        <input
                            type="number"
                            name="discount"
                            min="0"
                            max="100"
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
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
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
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
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
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none bg-white"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="electronics">Electronics</option>
                            <option value="jewelry">Jewelry</option>
                            <option value="men's clothing">Men's Clothing</option>
                            <option value="women's clothing">Women's Clothing</option>
                            <option value="others">Others</option>
                        </select>
                    </div>
                    <div className="flex items-center pt-8">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="isFeatured"
                                className="w-5 h-5 text-gray-900 rounded border-gray-300 focus:ring-gray-900"
                                checked={formData.isFeatured}
                                onChange={handleChange}
                            />
                            <span className="ml-2 text-sm text-gray-900 font-medium">Mark as Featured Product</span>
                        </label>
                    </div>
                </div>

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
                        disabled={submitting}
                        className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50"
                    >
                        {submitting ? "Updating..." : "Update Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
