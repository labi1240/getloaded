
import React, { Suspense } from 'react';
import ProductLoading from '@/components/ProductLoading';
import { notFound } from 'next/navigation';
import { getProductBySlug, getOffers, getPairedProduct } from '@/lib/data';
import ProductDetail from '@/components/ProductDetail';

export default function FirearmPage({ params }: { params: Promise<{ slug: string }> }) {
    return (
        <Suspense fallback={<ProductLoading />}>
            <FirearmProductContent params={params} />
        </Suspense>
    );
}

async function FirearmProductContent({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // 1. Fetch Static Product Data (Cached MAX)
    const product = await getProductBySlug(slug);

    if (!product || product.kind !== 'FIREARM') {
        notFound();
    }

    // 2. Fetch Dynamic Offers (Cached HOURS)
    const offers = await getOffers(product.id);

    // 3. Fetch Optimized Pairing (firearms only)
    const pairedProduct = await getPairedProduct(product.id);

    // Merge offers into product
    const productWithOffers = { ...product, offers };

    return (
        <ProductDetail initialProduct={productWithOffers} pairedProduct={pairedProduct} />
    );
}
