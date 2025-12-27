'use server';

import { getProducts, getTopBrands, getTopRetailers } from '@/lib/data';
import { Product as HomeProduct } from './types';
import { Product as DBProduct } from '@/types';

export async function searchHomeProducts(query: string, kind: 'AMMO' | 'FIREARM' = 'AMMO'): Promise<HomeProduct[]> {
    try {
        const products = await getProducts(kind, 20, 0, { search: query });

        return products.map((p: DBProduct) => mapToHomeProduct(p));
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
}

function mapToHomeProduct(p: DBProduct): HomeProduct {
    // Best Offer Logic
    const bestOffer = p.offers?.[0] || null;
    const bestPrice = bestOffer?.price || 0;

    // Calculate specific fields
    const retailerRating = p.brand?.name ? 5 : 4; // Mock rating if unavailable
    const shippingScore = bestOffer ? (bestOffer.freeShipping ? 10 : 7) : 0;
    const shippingText = bestOffer?.freeShipping ? 'FREE SHIPPING' : (bestOffer?.shippingCost ? `+ $${bestOffer.shippingCost} Ship` : 'Calculate Shipping');

    return {
        id: p.id,
        name: p.title,
        price: bestPrice,
        retailer: bestOffer?.retailer?.name || 'Unknown Retailer',
        retailerRating: typeof bestOffer?.retailer?.id === 'number' ? 4.8 : 0, // Mock or fetch if available
        image: p.image,
        lastUpdated: 'Just now',
        shippingScore,
        shippingText,
        isSponsored: false,
        brand: p.brand?.name || 'Unknown',
        condition: 'New', // Defaulting for now
        category: p.kind.toLowerCase() as 'ammo' | 'firearm',

        // Ammo Specifics
        caliber: p.caliber || p.title.split(' ')[0], // Fallback
        grains: p.grain,
        cpr: bestOffer?.cpr,
        casing: p.casing as any,
        roundCount: bestOffer?.roundCount
    };
}

export async function fetchTopBrands() {
    const brands = await getTopBrands(12);
    return brands.map(b => ({
        name: b.name,
        domain: b.slug, // using slug as domain proxy if needed, or website
        logo: b.logo,
        count: b._count.CatalogItem
    }));
}

export async function fetchTopRetailers() {
    const retailers = await getTopRetailers(8);
    return retailers.map(r => ({
        name: r.name,
        domain: r.domain,
        logo: r.logo,
        count: r._count.Offer,
        rating: r.rating || 0
    }));
}
