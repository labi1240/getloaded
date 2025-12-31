import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GlobalProvider } from '@/components/GlobalProvider';
import CompareTrayWrapper from '@/components/CompareTrayWrapper';
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { getRetailers } from '@/lib/data';
import RetailerHydrator from '@/components/RetailerHydrator';
import { Header } from '@/components/home/Header';
import { Footer } from '@/components/Footer';
// import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: '#ffffff',
};

export const metadata: Metadata = {
    // Defines how the title looks on inner pages (e.g., "Page Name | AmmoMetric")
    title: {
        template: '%s | AmmoMetric',
        default: 'AmmoMetric | Real-time pricing for ammo and firearms', // Fallback title
    },
    description: 'Real-time pricing and inventory search for ammunition and firearms across top retailers.',
    //
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body suppressHydrationWarning className={`${inter.className} min-h-screen bg-slate-50 font-sans text-slate-900 transition-colors duration-300`}>
                <NuqsAdapter>
                    <GlobalProvider>
                        <Suspense>
                            <RetailerFetcher />
                        </Suspense>
                        <Suspense>
                            {/* <Navbar /> */}
                            <Header />
                        </Suspense>
                        <main className="min-h-[calc(100vh-400px)]">
                            {children}
                        </main>
                        <Footer />
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
