"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { formatPKR } from "@/utils/currency";
import { formatDateTime } from "@/utils/dateUtils";

export default function AdminDealsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDealProducts = async () => {
        try {
            const res = await api.get("/products/deals");
            setProducts(res.data);
        } catch (error) {
            console.error("Failed to fetch deal products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDealProducts();
    }, []);

    const handleRemoveFromDeal = async (id) => {
        if (!confirm("Are you sure you want to remove this product from deals?")) return;
        try {
            await api.put(`/products/${id}`, { isDeal: false });
            fetchDealProducts();
        } catch (error) {
            console.error("Failed to remove from deal", error);
            alert("Failed to update product");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading deals...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Active Deals</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage special offers</p>
                </div>
                <Link href="/admin/products/add" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    + Add New Product
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deal Label</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Note</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ends At</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                <img src={product.image} alt="" className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 line-clamp-1">{product.title}</p>
                                                <p className="text-xs text-gray-400 capitalize">{product.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold uppercase">
                                            {product.dealLabel || "DEAL"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600 truncate max-w-[150px] block" title={product.dealNote}>{product.dealNote || "-"}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {formatDateTime(product.dealEndsAt) || "Indefinite"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/products/edit/${product._id}`} className="text-gray-400 hover:text-blue-600">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </Link>
                                            <button onClick={() => handleRemoveFromDeal(product._id)} className="text-red-400 hover:text-red-600" title="Remove from Deal">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colspan="5" className="px-6 py-12 text-center text-gray-500 italic">
                                    No active deals found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
