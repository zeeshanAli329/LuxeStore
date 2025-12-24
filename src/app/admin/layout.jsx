"use client";
import Link from "next/link";
import { useStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Skeleton from "@/components/ui/Skeleton";
import { AdminDashboardSkeleton } from "@/components/ui/Skeletons";

export default function AdminLayout({ children }) {
    const { user, loading } = useStore();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.replace("/login?next=/admin");
            return;
        }
        if (user.role !== "admin") {
            router.replace("/");
            return;
        }
        setAuthorized(true);
    }, [user, loading, router]);

    if (loading || !authorized) {
        return (
            <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
                <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex-shrink-0 p-6 space-y-4">
                    <Skeleton className="h-8 w-3/4 mb-10" />
                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
                </aside>
                <main className="flex-1 p-4 md:p-8">
                    <AdminDashboardSkeleton />
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            {/* Sidebar - Mobile Responsive */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex-shrink-0">
                <div className="p-6 border-b border-gray-100 hidden md:block">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Admin Panel</h2>
                </div>

                {/* Mobile Header (visible only on small screens) */}
                <div className="md:hidden p-4 border-b border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Admin Menu</span>
                </div>

                <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-100px)] md:max-h-full">
                    <NavLink href="/admin" label="Dashboard" />
                    <NavLink href="/admin/products" label="Products" />
                    <NavLink href="/admin/orders" label="Orders" />
                    <NavLink href="/admin/users" label="Users" />
                    <NavLink href="/admin/settings" label="Settings" />

                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <Link href="/" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                            <span>View Shop</span>
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

function NavLink({ href, label }) {
    return (
        <Link
            href={href}
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group"
        >
            <span>{label}</span>
        </Link>
    );
}
