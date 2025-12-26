"use client";
import { useState } from "react";

import api from "@/lib/api";
import { formatPKR } from "@/utils/currency";


export default function BoutiqueBookingModal({ product, isOpen, onClose }) {
    const [formData, setFormData] = useState({
        customerName: "",
        phone: "",
        city: "",
        notes: "",
        requiredDate: ""
    });

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const payload = {
                productId: product._id || product.id,
                productName: product.title,
                ...formData
            };

            await api.post("/boutique/book", payload);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to submit booking");
        } finally {
            setSubmitting(false);
        }
    };


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">Book This Design</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-8">
                    {success ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Submitted!</h3>
                            <p className="text-gray-600 mb-6">We have received your request for <strong>{product.title}</strong>. Our team will contact you shortly.</p>
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name *</label>
                                <input
                                    type="text"
                                    name="customerName"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="e.g. 0300 1234567"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Required By Date *</label>
                                <input
                                    type="date"
                                    name="requiredDate"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.requiredDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">City (Optional)</label>
                                <input
                                    type="text"
                                    name="city"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Your city"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Customization Details (Optional)</label>
                                <textarea
                                    name="notes"
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Any specific requests?"
                                />
                            </div>

                            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
                            >
                                {submitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Submitting...
                                    </div>
                                ) : "Confirm Booking"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

