"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { TableSkeleton } from "@/components/ui/Skeletons";
import { formatPKR } from "@/utils/currency";

export default function BoutiqueBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchBookings = async () => {
        try {
            const res = await api.get("/boutique/bookings");
            setBookings(res.data);
        } catch (error) {
            console.error("Failed to load bookings", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.patch(`/boutique/bookings/${id}/status`, { status: newStatus });
            setBookings(bookings.map(b => b._id === id ? { ...b, status: newStatus } : b));
        } catch (error) {
            console.error("Failed to update status", error);
            alert(error.response?.data?.message || "Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-8">Boutique Bookings</h1>
                <TableSkeleton rows={10} columns={7} />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Boutique Designs Requests</h1>
                <p className="text-gray-500 mt-2">Manage customer requests for custom designs and location visits.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Date / Required By</th>
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Design / Product</th>
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Payment</th>
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Screenshot</th>
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 tracking-wider text-right">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.map(booking => (
                                <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex flex-col">
                                            <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                                            <span className="text-xs text-red-500 font-semibold mt-1">
                                                Req: {new Date(booking.requiredDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                                        <div className="flex flex-col">
                                            <span>{booking.customerName}</span>
                                            <span className="text-xs font-normal text-gray-500">{booking.phone}</span>
                                            <span className="text-xs font-normal text-gray-400">{booking.city}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {booking.productName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900">{formatPKR(booking.advancePaidAmount)}</span>
                                            <span className="text-xs text-green-600 font-medium">Advance Paid</span>
                                            <span className="text-xs text-gray-400">Total: {formatPKR(booking.totalPrice)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {booking.paymentScreenshot ? (
                                            <button
                                                onClick={() => setSelectedImage(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${booking.paymentScreenshot}`)}
                                                className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden relative group"
                                            >
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${booking.paymentScreenshot}`}
                                                    alt="Payment"
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                    </svg>
                                                </div>
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">No Image</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={booking.status}
                                            onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                                            className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer ${booking.status === "New" ? "bg-blue-100 text-blue-700" :
                                                booking.status === "Advance Paid" ? "bg-emerald-100 text-emerald-700" :
                                                    booking.status === "Confirmed" ? "bg-purple-100 text-purple-700" :
                                                        booking.status === "Delivered" ? "bg-gray-800 text-white" :
                                                            "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            <option value="New">New</option>
                                            <option value="Advance Paid">Advance Paid</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={booking.notes}>
                                        {booking.notes || "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {bookings.length === 0 && (
                    <div className="p-20 text-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
                        <p className="mt-1">When customers book a design, they will appear here.</p>
                    </div>
                )}
            </div>

            {/* Image Viewer Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-4xl max-h-[90vh] p-2">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img
                            src={selectedImage}
                            alt="Payment Proof Full"
                            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

