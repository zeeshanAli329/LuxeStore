import { TableSkeleton } from "@/components/ui/Skeletons";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminOrdersLoading() {
    return (
        <div className="p-8">
            <Skeleton className="h-8 w-32 mb-6" />
            <TableSkeleton rows={10} columns={5} />
        </div>
    );
}
