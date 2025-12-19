"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../../../utils/api";

export default function EditProductPage({ params }) {
    const { id } = params;
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
        isFeatured: false
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
                    isFeatured: p.isFeatured
                });
            } catch (error) {
                console.error("Failed to fetch product", error);
                alert("Failed to load product");
                router.push("/admin/manage-products");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, router]);

    const handleChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put(`/products/${id}`, formData);
            alert("Product updated successfully!");
            router.push("/admin/manage-products");
        } catch (error) {
            console.error(error);
            alert("Failed to update product: " + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8">Loading product...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Product</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md space-y-6">

                {/* Image URL */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image URL</label>
                    <input
                        type="url"
                        name="image"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.image}
                        onChange={handleChange}
                    />
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        required
                        rows="4"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                {/* Prices */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Old Price ($)</label>
                        <input
                            type="number"
                            name="oldPrice"
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={formData.oldPrice}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Price ($)</label>
                        <input
                            type="number"
                            name="newPrice"
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={formData.newPrice}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                        <input
                            type="number"
                            name="discount"
                            min="0"
                            max="100"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
                            value={formData.discount}
                            onChange={handleChange}
                            placeholder="Auto"
                        />
                    </div>
                </div>

                {/* Category & Stock */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            name="category"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                        <input
                            type="number"
                            name="stock"
                            required
                            min="0"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={formData.stock}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="isFeatured"
                        id="isFeatured"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                    />
                    <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                        Mark as Featured Product
                    </label>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg"
                    >
                        {submitting ? "Updating..." : "Update Product"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/admin/manage-products")}
                        className="w-full mt-3 text-gray-600 py-2 font-medium hover:text-gray-900"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
