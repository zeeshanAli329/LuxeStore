"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith("/admin");

    return (
        <>
            {!isAdminRoute && <Navbar />}
            <main className="flex-grow">{children}</main>
            {!isAdminRoute && <Footer />}
        </>
    );
}
