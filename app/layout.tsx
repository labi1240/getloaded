import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GlobalProvider } from '@/components/GlobalProvider';
import Navbar from '@/components/Navbar';
import CompareTrayWrapper from '@/components/CompareTrayWrapper';
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { getRetailers } from '@/lib/data';
import RetailerHydrator from '@/components/RetailerHydrator';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'AmmoTerminal',
    description: 'Real-time pricing for ammo and firearms',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body suppressHydrationWarning className={`${inter.className} min-h-screen bg-slate-50 font-sans text-slate-900 pb-24 transition-colors duration-300`}>
                <NuqsAdapter>
                    <GlobalProvider>
                        <Suspense>
                            <RetailerFetcher />
                        </Suspense>
                        <Suspense>
                            <Navbar />
                        </Suspense>
                        <main>
                            {children}
                        </main>
                        <CompareTrayWrapper />
                    </GlobalProvider>
                </NuqsAdapter>
            </body>
        </html>
    );
}

async function RetailerFetcher() {
    let retailers: any[] = [];
    try {
        retailers = await getRetailers();
    } catch (error) {
        console.warn('Failed to fetch retailers in RootLayout:', error);
    }
    return <RetailerHydrator retailers={retailers} />;
}
