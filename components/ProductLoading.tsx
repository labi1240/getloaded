import React from 'react';

const ProductLoading = () => {
    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb Skeleton */}
                <div className="flex mb-8 gap-2 items-center">
                    <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-3 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-3 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-48 bg-slate-200 rounded animate-pulse" />
                </div>

                {/* Hero Product Skeleton */}
                <div className="bg-white rounded-2xl shadow-xs ring-1 ring-slate-900/5 overflow-hidden mb-12">
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-2/5 h-96 bg-slate-100 flex items-center justify-center animate-pulse" />
                        <div className="p-10 lg:p-14 flex-1 space-y-8">
                            <div className="flex justify-between">
                                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                                <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
                            </div>
                            <div className="h-12 w-3/4 bg-slate-200 rounded animate-pulse" />
                            <div className="flex gap-4">
                                <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
                                <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
                            </div>
                            <div className="pt-12 border-t border-slate-100 flex justify-between items-end">
                                <div className="space-y-4">
                                    <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                                    <div className="h-16 w-48 bg-slate-200 rounded animate-pulse" />
                                </div>
                                <div className="h-16 w-48 bg-slate-900/10 rounded-2xl animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Liquidity Table Skeleton */}
                <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden mb-12 h-64 animate-pulse" />
            </div>
        </div>
    );
};

export default ProductLoading;
