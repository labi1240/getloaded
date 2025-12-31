// app/ammo/[...slug]/page.tsx
import React, { Suspense } from 'react';
import ProductLoading from '@/components/ProductLoading';
import { getProductBySlug, getOffers, getPairedProduct, getProducts, isValidCaliberSlug, isValidBrandSlug, getPriceHistory } from '@/lib/data';
import ProductDetail from '@/components/ProductDetail';
import CategoryPage from '@/components/CategoryPage';
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

    // B. Check if this is a Category Page (Filters)
    const activeFilters: string[] = [];
    
    for (const segment of segments) {
        if (await isValidCaliberSlug(segment)) {
            // Convert slug "9mm-luger" to "9mm Luger" for pretty display
            activeFilters.push(formatSlug(segment)); 
        } else if (await isValidBrandSlug(segment)) {
            activeFilters.push(formatSlug(segment));
        } else if (segment.match(/^\d+gr$/i)) {
            activeFilters.push(segment); // Keep "115gr" as is
        }
    }

    if (activeFilters.length > 0) {
        const titleStr = activeFilters.join(' ');
        return {
            title: `${titleStr} Ammo For Sale | In Stock | AmmoMetric`,
            description: `Browse the best deals on ${titleStr} ammunition. Real-time inventory search from 100+ retailers.`,
            openGraph: {
                title: `${titleStr} Ammo In Stock`,
                description: `Find cheap ${titleStr} ammo. Compare prices instantly.`,
                type: 'website'
            }
        };
    }

    return {
        title: 'Ammunition Search | AmmoMetric',
        description: 'Find in-stock ammunition at the lowest prices.'
    };
}

// Helper to pretty-print slugs (e.g., "federal-premium" -> "Federal Premium")
function formatSlug(slug: string) {
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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

    // 2. Try as Category Route
    // Parse segments for filters
    const filters: { caliberSlug?: string[]; brandSlug?: string[]; grain?: string[]; casings?: string[] } = {};
    let hasValidFilter = false;

    // We iterate segments to find matches. 
    // This allows flexible ordering like /ammo/9mm-luger or /ammo/federal-premium
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

        // Check Grain (e.g. "147gr", "115gr")
        const grainMatch = segment.match(/^(\d+)gr$/i);
        if (grainMatch) {
            filters.grain = [grainMatch[1]]; // Pass as string array
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
        const initialProducts = await getProducts('AMMO', 100, 0, filters);

        // Pass Hydrated State to Category Page
        // We construct the initialFilters object for NUQS to sync
        const initialClientFilters: any = {};
        if (filters.brandSlug) initialClientFilters.brands = filters.brandSlug;
        if (filters.caliberSlug) initialClientFilters.calibers = filters.caliberSlug;
        if (filters.grain) initialClientFilters.grains = filters.grain;

        return <CategoryPage initialProducts={initialProducts} kind="AMMO" filters={initialClientFilters} />;
    }

    // 3. Fallback
    notFound();
}
