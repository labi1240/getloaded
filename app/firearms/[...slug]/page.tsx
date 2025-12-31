// app/firearms/[...slug]/page.tsx
import React, { Suspense } from 'react';
import ProductLoading from '@/components/ProductLoading';
import { notFound } from 'next/navigation';
import { getProductBySlug, getOffers, getPairedProduct, getProducts, isValidCaliberSlug, isValidBrandSlug, getPriceHistory } from '@/lib/data';
import ProductDetail from '@/components/ProductDetail';
import CategoryPage from '@/components/CategoryPage';
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

    // B. Category (e.g. /firearms/glock or /firearms/9mm-luger)
    const activeFilters: string[] = [];
    
    for (const segment of segments) {
        if (await isValidCaliberSlug(segment)) {
            activeFilters.push(formatSlug(segment));
        } else if (await isValidBrandSlug(segment)) {
            activeFilters.push(formatSlug(segment));
        }
    }

    if (activeFilters.length > 0) {
        const titleStr = activeFilters.join(' ');
        return {
            title: `${titleStr} Guns For Sale | AmmoMetric`,
            description: `Shop huge inventory of ${titleStr} firearms. Compare prices on pistols, rifles, and shotguns.`,
            openGraph: {
                title: `${titleStr} Guns In Stock`,
                description: `Best deals on ${titleStr} firearms.`,
                type: 'website'
            }
        };
    }

    return {
        title: 'Firearm Search | AmmoMetric',
        description: 'Find in-stock firearms at the lowest prices.'
    };
}

// Helper
function formatSlug(slug: string) {
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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
