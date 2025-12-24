import { TableSkeleton } from "@/components/ui/Skeletons";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminUsersLoading() {
    return (
        <div className="p-8">
            <Skeleton className="h-8 w-32 mb-6" />
            <TableSkeleton rows={10} columns={4} />
        </div>
    );
}
