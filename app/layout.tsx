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
import Script from 'next/script';
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
                        <Script 
                            src="http://classic.avantlink.com/affiliate_app_confirm.php?mode=js&authResponse=edd05a5dabdd39656eef563e80b203f3c6556ce1" 
                            strategy="afterInteractive" 
                        />
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
