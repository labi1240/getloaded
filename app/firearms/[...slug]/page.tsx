
import React, { Suspense } from 'react';
import ProductLoading from '@/components/ProductLoading';
import { notFound } from 'next/navigation';
import { getProductBySlug, getOffers, getPairedProduct, getProducts, isValidCaliberSlug, isValidBrandSlug } from '@/lib/data';
import ProductDetail from '@/components/ProductDetail';
import CategoryPage from '@/components/CategoryPage';

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
            const offers = await getOffers(product.id);
            const pairedProduct = await getPairedProduct(product.id);
            const productWithOffers = { ...product, offers };
            return <ProductDetail initialProduct={productWithOffers} pairedProduct={pairedProduct} />;
        }
    }

    // 2. Try as Category Route
    const filters: { caliberSlug?: string[]; brandSlug?: string[] } = {};
    let hasValidFilter = false;

    for (const segment of segments) {
        // Check Caliber
        if (await isValidCaliberSlug(segment)) {
            filters.caliberSlug = [segment];
            hasValidFilter = true;
            continue;
        }

        // Check Brand
        if (await isValidBrandSlug(segment)) {
            filters.brandSlug = [segment];
            hasValidFilter = true;
            continue;
        }
    }

    if (hasValidFilter) {
        // Fetch server-side filtered products for SEO
        const initialProducts = await getProducts('FIREARM', 100, 0, filters);

        // Pass Hydrated State to Category Page
        // We construct the initialFilters object for NUQS to sync
        const initialClientFilters: any = {};
        if (filters.brandSlug) initialClientFilters.brands = filters.brandSlug;
        if (filters.caliberSlug) initialClientFilters.calibers = filters.caliberSlug;

        return <CategoryPage initialProducts={initialProducts} kind="FIREARM" filters={initialClientFilters} />;
    }

    // 3. Fallback
    notFound();
}
