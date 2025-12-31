// app/firearms/[...slug]/page.tsx
import React, { Suspense } from 'react';
import ProductLoading from '@/components/ProductLoading';
import { notFound } from 'next/navigation';
import { getProductBySlug, getOffers, getPairedProduct, getPriceHistory } from '@/lib/data';
import ProductDetail from '@/components/ProductDetail';
import { Metadata } from 'next';

// --- NEW: Dynamic Metadata Generator ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
    const { slug: segments } = await params;

    // A. Single Product
    if (segments.length === 1) {
        const product = await getProductBySlug(segments[0]);
        if (product && product.kind === 'FIREARM') {
            const bestPrice = product.offers?.[0]?.price ? `$${product.offers[0].price}` : 'great prices';
            
            return {
                title: `${product.title} | AmmoMetric`,
                description: `Buy ${product.title} online. Compare inventory from top gun stores. Best price found: ${bestPrice}.`,
                openGraph: {
                    title: product.title,
                    description: `Find in-stock ${product.title}. Lowest price: ${bestPrice}.`,
                    images: product.image ? [product.image] : [],
                    type: 'article'
                }
            };
        }
    }

    return {
        title: 'Firearm Search | AmmoMetric',
        description: 'Find in-stock firearms at the lowest prices.'
    };
}

export default function FirearmsSmartRoute({ params }: { params: Promise<{ slug: string[] }> }) {
    return (
        <Suspense fallback={<ProductLoading />}>
            <SmartContent params={params} />
        </Suspense>
    );
}

async function SmartContent({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug: segments } = await params;

    // 1. Try as Product (only if 1 segment, typically)
    if (segments.length === 1) {
        const product = await getProductBySlug(segments[0]);
        if (product && product.kind === 'FIREARM') {
            const [offers, pairedProduct, priceHistory] = await Promise.all([
                getOffers(product.id),
                getPairedProduct(product.id),
                getPriceHistory(product.id)
            ]);
            const productWithData = { ...product, offers, priceHistory };
            return <ProductDetail initialProduct={productWithData} pairedProduct={pairedProduct} />;
        }
    }

    // 2. Fallback
    notFound();
}
