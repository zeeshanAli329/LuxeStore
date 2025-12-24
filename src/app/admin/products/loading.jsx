import { TableSkeleton } from "@/components/ui/Skeletons";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminProductsLoading() {
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
            <TableSkeleton rows={10} columns={5} />
        </div>
    );
}
