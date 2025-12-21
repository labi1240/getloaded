
import React, { Suspense } from 'react';
import ProductLoading from '@/components/ProductLoading';
import { notFound } from 'next/navigation';
import { getProductBySlug, getOffers, getPairedProduct, getProducts, isValidCaliberSlug, isValidBrandSlug } from '@/lib/data';
import ProductDetail from '@/components/ProductDetail';
import CategoryPage from '@/components/CategoryPage';

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
            const offers = await getOffers(product.id);
            const pairedProduct = await getPairedProduct(product.id);
            const productWithOffers = { ...product, offers };
            return <ProductDetail initialProduct={productWithOffers} pairedProduct={pairedProduct} />;
        }
    }

    // 2. Try as Category Route
    // Parse segments for filters
    const filters: { caliberSlug?: string; brandSlug?: string; grain?: number; casings?: string[] } = {};
    let hasValidFilter = false;

    // We iterate segments to find matches. 
    // This allows flexible ordering like /ammo/9mm-luger or /ammo/federal-premium
    for (const segment of segments) {
        // Check Caliber
        if (await isValidCaliberSlug(segment)) {
            filters.caliberSlug = segment;
            hasValidFilter = true;
            continue;
        }

        // Check Brand
        if (await isValidBrandSlug(segment)) {
            filters.brandSlug = segment;
            hasValidFilter = true;
            continue;
        }

        // Check Grain (e.g. "147gr", "115gr")
        const grainMatch = segment.match(/^(\d+)gr$/i);
        if (grainMatch) {
            filters.grain = parseInt(grainMatch[1], 10);
            hasValidFilter = true;
            continue;
        }

        // Check Casing (Optional - using simple whitelist for now as we don't have slug-helper)
        if (['brass', 'steel', 'aluminum', 'nickel'].includes(segment.toLowerCase())) {
            // Mapping common casing names to values if needed, or simple array passing
            // Since casing filter expects array, we treat this as one value
            // filters.casings = [segment]; // To be fully implemented in data.ts if needed
            // For now, we skip server-side filtering for casing but pass it to client
            // Client expects 'Brass' capitalized usually? Let's rely on standard search
            continue;
        }
    }

    if (hasValidFilter) {
        // Fetch server-side filtered products for SEO
        const initialProducts = await getProducts('AMMO', 50, 0, filters);

        // Pass Hydrated State to Category Page
        // We construct the initialFilters object for NUQS to sync
        const initialClientFilters: any = {};
        if (filters.brandSlug) initialClientFilters.brands = [filters.brandSlug];
        if (filters.caliberSlug) initialClientFilters.calibers = [filters.caliberSlug];
        if (filters.grain) initialClientFilters.grains = [filters.grain.toString()];

        return <CategoryPage initialProducts={initialProducts} kind="AMMO" filters={initialClientFilters} />;
    }

    // 3. Fallback
    notFound();
}
