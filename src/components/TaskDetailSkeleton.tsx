"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function TaskDetailSkeleton() {
    return (
        <div className="min-h-screen bg-black pt-24 pb-16">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Back buttons */}
                <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-5 w-32 bg-white/5 animate-pulse" />
                    <Skeleton className="h-5 w-32 bg-white/5 animate-pulse" />
                </div>

                {/* Task Header */}
                <div className="bg-zinc-950 border border-white/5 rounded-xl p-8 mb-8 shadow-none">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <Skeleton className="h-10 w-96 mb-3 bg-white/5 animate-pulse" />
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-4 w-40 bg-white/5 animate-pulse" />
                                <Skeleton className="h-4 w-32 bg-white/5 animate-pulse" />
                                <Skeleton className="h-4 w-36 bg-white/5 animate-pulse" />
                            </div>
                        </div>
                        <div className="text-right">
                            <Skeleton className="h-12 w-24 mb-2 ml-auto bg-white/5 animate-pulse" />
                            <Skeleton className="h-8 w-28 ml-auto bg-white/5 animate-pulse" />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-6">
                        <Skeleton className="h-9 w-52 bg-white/5 animate-pulse" />
                        <Skeleton className="h-9 w-36 bg-white/5 animate-pulse" />
                        <Skeleton className="h-9 w-24 bg-white/5 animate-pulse" />
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-white/5">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white/5 border-white/5 p-4">
                                <Skeleton className="h-4 w-28 mb-2 bg-white/5 animate-pulse" />
                                <Skeleton className="h-8 w-20 mb-1 bg-white/5 animate-pulse" />
                                <Skeleton className="h-3 w-32 bg-white/5 animate-pulse" />
                            </div>
                        ))}
                    </div>

                    {/* Annual Projection */}
                    <div className="mt-4 p-4 bg-white/5 border-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <Skeleton className="h-4 w-48 mb-2 bg-white/5 animate-pulse" />
                                <Skeleton className="h-7 w-32 mb-1 bg-white/5 animate-pulse" />
                                <Skeleton className="h-3 w-40 bg-white/5 animate-pulse" />
                            </div>
                            <div className="text-right">
                                <Skeleton className="h-4 w-24 mb-2 ml-auto bg-white/5 animate-pulse" />
                                <Skeleton className="h-5 w-28 ml-auto bg-white/5 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Prompt Comparison */}
                <div className="bg-zinc-950 border-white/5 shadow-none p-6 mb-8">
                    <Skeleton className="h-6 w-48 mb-4 bg-white/5 animate-pulse" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <Skeleton className="h-5 w-32 mb-3 bg-white/5 animate-pulse" />
                            <Skeleton className="h-48 w-full bg-white/5 animate-pulse" />
                        </div>
                        <div>
                            <Skeleton className="h-5 w-32 mb-3 bg-white/5 animate-pulse" />
                            <Skeleton className="h-48 w-full bg-white/5 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Sample Query Results */}
                <div className="bg-zinc-950 border-white/5 shadow-none p-6 mb-8">
                    <Skeleton className="h-6 w-56 mb-4 bg-white/5 animate-pulse" />
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="border-white/5 rounded-lg p-4">
                                <Skeleton className="h-5 w-full mb-4 bg-white/5 animate-pulse" />
                                <Skeleton className="h-32 w-full bg-white/5 animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Info */}
                <div className="bg-zinc-950 border border-white/5 rounded-xl p-6 shadow-none">
                    <Skeleton className="h-6 w-48 mb-4 bg-white/5 animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Skeleton className="h-4 w-32 mb-2 bg-white/5 animate-pulse" />
                            <Skeleton className="h-6 w-24 bg-white/5 animate-pulse" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-24 mb-2 bg-white/5 animate-pulse" />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-20 bg-white/5 animate-pulse" />
                                <Skeleton className="h-8 w-24 bg-white/5 animate-pulse" />
                                <Skeleton className="h-8 w-20 bg-white/5 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
