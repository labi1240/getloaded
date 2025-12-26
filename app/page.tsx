import Link from 'next/link';
import { RiAtLine, RiFocus2Line } from '@remixicon/react';
import TimeDisplay from '../components/TimeDisplay';

export default function HomePage() {
    return (
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-6xl mb-6">
                    Welcome to <span className="text-brand-600">GetLoaded</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                    The ultimate aggregator for ammunition and firearms. Find the best deals in stock now.
                </p>
                <div className="mt-4 text-sm text-slate-400 font-mono">
                    Last Refresh: <TimeDisplay />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Link
                    href="/firearms"
                    className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all"
                >
                    <div className="h-20 w-20 bg-brand-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-100 transition-colors">
                        <RiAtLine className="size-10 text-brand-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Firearms</h2>
                    <p className="text-slate-500 text-center">Browse our extensive collection of rifles, handguns, and shotguns.</p>
                </Link>

                <Link
                    href="/ammo"
                    className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all"
                >
                    <div className="h-20 w-20 bg-brand-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-100 transition-colors">
                        <RiFocus2Line className="size-10 text-brand-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Ammunition</h2>
                    <p className="text-slate-500 text-center">Find in-stock ammo by caliber, grain, and brand at the best prices.</p>
                </Link>
            </div>
        </div>
    );
}

