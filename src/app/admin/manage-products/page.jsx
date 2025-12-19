"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectToProducts() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/admin/products");
    }, [router]);
    return <div className="p-8">Redirecting...</div>;
}
