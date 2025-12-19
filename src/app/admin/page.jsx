"use client";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        sales: 0,
        orders: 0,
        products: 0,
        users: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, ordersRes, usersRes] = await Promise.all([
                    api.get("/products"),
                    api.get("/orders"),
                    api.get("/users")
                ]);

                const productsData = productsRes.data;
                const ordersData = ordersRes.data;
                const usersData = usersRes.data;

                const totalSales = ordersData.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

                setStats({
                    sales: totalSales,
                    orders: ordersData.length,
                    products: productsData.length,
                    users: usersData.length
                });

                setRecentOrders(ordersData.slice(0, 5));
                setRecentUsers(usersData.slice(0, 5));

            } catch (error) {
                console.error("Dashboard fetch error", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center py-10">Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Store Performance Overview</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Sales" value={`$${stats.sales.toFixed(2)}`} />
                <StatCard title="Total Orders" value={stats.orders} />
                <StatCard title="Total Products" value={stats.products} />
                <StatCard title="Total Users" value={stats.users} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Recent Orders</h3>
                        <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentOrders.map(order => (
                                    <tr key={order._id}>
                                        <td className="px-6 py-4 font-mono text-gray-600">#{order._id.slice(-6)}</td>
                                        <td className="px-6 py-4 capitalize">{order.status || 'Pending'}</td>
                                        <td className="px-6 py-4 text-right font-medium">${order.totalAmount?.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* New Users */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">New Users</h3>
                        <Link href="/admin/users" className="text-sm text-blue-600 hover:text-blue-700">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentUsers.map(u => (
                                    <tr key={u._id}>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{u.name}</div>
                                            <div className="text-xs text-gray-500">{u.email}</div>
                                        </td>
                                        <td className="px-6 py-4 capitalize">{u.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
}
