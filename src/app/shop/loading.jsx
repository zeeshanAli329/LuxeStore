import { ProductGridSkeleton } from "@/components/ui/Skeletons";
import Skeleton from "@/components/ui/Skeleton";

export default function ShopLoading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-64 flex-shrink-0 space-y-4">
                    <Skeleton className="h-6 w-32 mb-4" />
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
                <div className="flex-1">
                    <ProductGridSkeleton count={6} />
                </div>
            </div>
        </div>
    );
}
