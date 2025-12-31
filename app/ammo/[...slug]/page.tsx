// app/ammo/[...slug]/page.tsx
import React, { Suspense } from 'react';
import ProductLoading from '@/components/ProductLoading';
import { getProductBySlug, getOffers, getPairedProduct, getPriceHistory } from '@/lib/data';
import ProductDetail from '@/components/ProductDetail';
import { Metadata } from 'next';
import { notFound } from 'next/navigation'

// --- NEW: Dynamic Metadata Generator ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
    const { slug: segments } = await params;

    // A. Check if this is a Single Product Page
    if (segments.length === 1) {
        const product = await getProductBySlug(segments[0]);
        if (product && product.kind === 'AMMO') {
            const bestPrice = product.offers?.[0]?.price ? `$${product.offers[0].price}` : 'low prices';
            const offerCount = product.offers?.length || 0;
            
            return {
                title: `${product.title} | AmmoMetric`,
                description: `Compare prices for ${product.title}. We found ${offerCount} deals starting at ${bestPrice}. In-stock and ready to ship.`,
                openGraph: {
                    title: product.title,
                    description: `Compare prices from top retailers. Best deal: ${bestPrice}.`,
                    images: product.image ? [product.image] : [],
                    type: 'article'
                }
            };
        }
    }

    return {
        title: 'Ammunition Search | AmmoMetric',
        description: 'Find in-stock ammunition at the lowest prices.'
    };
}

export default function AmmoSmartRoute({ params }: { params: Promise<{ slug: string[] }> }) {
    return (
        <Suspense fallback={<ProductLoading />}>
            <SmartContent params={params} />
        </Suspense>
    );
}

async function SmartContent({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug: segments } = await params;
    const slugKey = segments.join('/');

    // 1. Try as Product (only if 1 segment, typically)
    // Products usually have long dashed slugs. 
    // We try this first to preserve existing PDPs.
    if (segments.length === 1) {
        const product = await getProductBySlug(segments[0]);
        if (product && product.kind === 'AMMO') {
            const [offers, pairedProduct, priceHistory] = await Promise.all([
                getOffers(product.id),
                getPairedProduct(product.id),
                getPriceHistory(product.id)
            ]);
            const productWithData = { ...product, offers, priceHistory };
            return <ProductDetail initialProduct={productWithData} pairedProduct={pairedProduct} />;
        }
    }

    // 3. Fallback
    notFound();
}
