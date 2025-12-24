import { AdminDashboardSkeleton } from "@/components/ui/Skeletons";

export default function AdminLoading() {
    return (
        <div className="p-8">
            <AdminDashboardSkeleton />
        </div>
    );
}
