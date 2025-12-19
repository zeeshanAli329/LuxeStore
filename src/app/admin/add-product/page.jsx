"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectToAddProduct() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/admin/products/add");
    }, [router]);
    return <div className="p-8">Redirecting...</div>;
}
