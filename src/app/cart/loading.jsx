import { CartSkeleton } from "@/components/ui/Skeletons";

export default function CartLoading() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <CartSkeleton />
        </div>
    );
}
