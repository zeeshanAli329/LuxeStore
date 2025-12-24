import { ProductGridSkeleton } from "@/components/ui/Skeletons";
import Skeleton from "@/components/ui/Skeleton";

export default function FavoritesLoading() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Skeleton className="h-10 w-48 mb-8" />
                <ProductGridSkeleton count={4} />
            </div>
        </div>
    );
}
