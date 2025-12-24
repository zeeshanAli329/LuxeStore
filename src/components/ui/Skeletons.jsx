"use client";

import Skeleton from "./Skeleton";

// --- Product Skeletons ---

export const ProductCardSkeleton = () => (
    <div className="bg-white rounded-[12px] shadow-sm p-4 flex flex-col h-full border border-gray-100">
        <Skeleton className="h-48 w-full mb-4 rounded-md" />
        <div className="flex flex-col flex-grow">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-3" />
            <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-20" />
            </div>
        </div>
    </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: count }).map((_, i) => (
            <ProductCardSkeleton key={i} />
        ))}
    </div>
);

// --- Table Skeletons ---

export const TableRowSkeleton = ({ columns = 5 }) => (
    <tr className="animate-pulse">
        {Array.from({ length: columns }).map((_, i) => (
            <td key={i} className="px-6 py-4">
                <Skeleton className="h-4 w-full" />
            </td>
        ))}
    </tr>
);

export const TableSkeleton = ({ rows = 5, columns = 5 }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100 uppercase">
                    <tr>
                        {Array.from({ length: columns }).map((_, i) => (
                            <th key={i} className="px-6 py-4 h-12">
                                <Skeleton className="h-3 w-16" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {Array.from({ length: rows }).map((_, i) => (
                        <TableRowSkeleton key={i} columns={columns} />
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// --- Detail View Skeletons ---

export const DetailsSkeleton = () => (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 h-4 w-48">
            <Skeleton className="h-full w-full" />
        </nav>
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <Skeleton className="h-[400px] w-full rounded-xl" />
                <div className="flex flex-col justify-center space-y-4">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-12 w-1/3" />
                    <div className="space-y-2 pt-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="flex gap-4 pt-8">
                        <Skeleton className="h-14 flex-1 rounded-xl" />
                        <Skeleton className="h-14 flex-1 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- Cart Skeletons ---

export const CartSkeleton = () => (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-6 space-y-4">
        <Skeleton className="h-8 w-48 mb-6" />
        {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-6 py-4 border-b last:border-0">
                <Skeleton className="w-20 h-20 rounded-md" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-20 h-6" />
            </div>
        ))}
    </div>
);

// --- Admin Dashboard Skeletons ---

export const AdminDashboardSkeleton = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
        </div>
        <TableSkeleton rows={8} columns={5} />
    </div>
);

// --- Form Skeletons (Login/Signup) ---

export const FormSkeleton = () => (
    <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-sm">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full rounded-md mt-6" />
        </div>
        <Skeleton className="h-4 w-1/2 mx-auto" />
    </div>
);
