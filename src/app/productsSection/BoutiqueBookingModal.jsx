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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[85vh] md:max-h-[90vh] animate-in fade-in zoom-in duration-300 overflow-hidden">

                {/* Header - Fixed at top */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-none">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">Book This Design</h2>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-5 overflow-y-auto flex-1">
                    {success ? (
                        <div className="text-center py-4 flex flex-col items-center justify-center h-full">
                            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Booking Submitted!</h3>
                            <p className="text-sm text-gray-600 mb-0">Request for <strong>{product.title}</strong> received.</p>
                        </div>
                    ) : (
                        <form id="booking-form" onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Your Name *</label>
                                <input
                                    type="text"
                                    name="customerName"
                                    required
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="e.g. 0300 1234567"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Required By Date *</label>
                                <input
                                    type="date"
                                    name="requiredDate"
                                    required
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                    value={formData.requiredDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">City (Optional)</label>
                                <input
                                    type="text"
                                    name="city"
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Your city"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Customization Details (Optional)</label>
                                <textarea
                                    name="notes"
                                    rows="2"
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-sm"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Any specific requests?"
                                />
                            </div>

                            {error && <p className="text-red-500 text-xs font-medium bg-red-50 p-2 rounded">{error}</p>}
                        </form>
                    )}
                </div>

                {/* Footer - Fixed at bottom */}
                <div className="p-4 border-t border-gray-100 flex-none bg-white">
                    {success ? (
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-md text-sm"
                        >
                            Close
                        </button>
                    ) : (
                        <button
                            type="submit"
                            form="booking-form"
                            disabled={submitting}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md disabled:opacity-50 text-sm"
                        >
                            {submitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Submitting...
                                </div>
                            ) : "Confirm Booking"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

