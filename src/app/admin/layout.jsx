"use client";
import Link from "next/link";
import { useStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
    const { user, loading } = useStore();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Strict Guard Logic
        // 1. If loading, do nothing (wait)
        if (loading) return;

        // 2. If no user -> redirect to login with return url
        if (!user) {
            router.replace("/login?next=/admin");
            return;
        }

        // 3. If user exists but NOT admin -> access denied
        if (user.role !== "admin") {
            router.replace("/");
            return;
        }

        // 4. If all checks pass -> Authorize
        setAuthorized(true);
    }, [user, loading, router]);

    // Show loading spinner until fully authorized
    // This blocks any partial render of the admin UI
    if (loading || !authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
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
