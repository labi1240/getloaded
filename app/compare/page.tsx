import React from 'react';
import CompareView from '@/components/CompareView';
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'AmmoMetric | Find In-Stock Guns & Ammo Instantly',
    description: 'The ultimate aggregator for ammunition and firearms. Compare live inventory from 100+ vetted retailers. Scan barcodes or search to find the best deals.',
    keywords: ['ammo', 'guns', 'firearms', 'price comparison', 'in-stock ammo', '9mm ammo', '5.56 ammo'],
    openGraph: {
        title: 'AmmoMetric | Real-time Gun & Ammo Search',
        description: 'Compare prices from 100+ retailers instantly.',
        type: 'website',
    }
};

export default function ComparePage() {
    return <CompareView />;
}

