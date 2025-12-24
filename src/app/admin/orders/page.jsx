"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { formatPKR } from "@/utils/currency";
import { TableSkeleton } from "@/components/ui/Skeletons";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/orders");
            setOrders(res.data);
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.patch(`/orders/${id}/status`, { status: newStatus });
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to update status";
            alert(msg);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <Skeleton className="h-8 w-32 mb-6" />
                <TableSkeleton rows={10} columns={5} />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map(order => (
                                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                        #{order._id.slice(-6)}
                                        <div className="text-xs text-gray-400 mt-1">{order.paymentMethod}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-900">{order.shippingAddress?.fullName || order.user?.name || "Guest"}</div>
                                        <div className="text-[11px] text-gray-500 leading-tight mt-1">
                                            {order.shippingAddress?.address}, {order.shippingAddress?.city}
                                            <br />
                                            CP: {order.shippingAddress?.postalCode}
                                        </div>
                                        <div className="text-xs font-semibold text-blue-600 mt-1">{order.shippingAddress?.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatPKR(order.totalAmount)}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                            className={`text-xs font-semibold px-2 py-1 rounded-full border-none outline-none cursor-pointer
                                                ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            {order.products?.map((item, i) => (
                                                <div key={i} className="text-[10px] leading-tight text-gray-600 bg-gray-50 p-1 rounded border border-gray-100">
                                                    <span className="font-bold">{item.quantity}x</span> {item.product?.title || "Product"}
                                                    {(item.selectedColor || item.selectedSize) && (
                                                        <span className="text-blue-600 font-medium ml-1">
                                                            ({item.selectedColor || '-'}, {item.selectedSize || '-'})
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-gray-500">No orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
