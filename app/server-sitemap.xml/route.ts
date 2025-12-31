import { getServerSideSitemap } from 'next-sitemap'
import prisma from '@/lib/prisma'
import { ISitemapField } from 'next-sitemap'

export async function GET(request: Request) {
    // 1. Fetch Products
    // CRITICAL FIX: Added 'take: 45000' to prevent timeout (Google limit is 50k per file)
    const products = await prisma.catalogItem.findMany({
        select: {
            slug: true,
            kind: true,
            updatedAt: true
        },
        take: 45000 // Leave room for brands/calibers to fit in 50k limit
    });

    // 2. Fetch Brands
    const brands = await prisma.brand.findMany({
        select: { slug: true }
    });

    // 3. Fetch Calibers
    const calibers = await prisma.caliber.findMany({
        select: { slug: true }
    });

    const fields: ISitemapField[] = [];
    
    // Use your production domain if available, otherwise fallback
    const baseUrl = process.env.SITE_URL || 'https://www.ammometric.com'; 

    // Helper to safely encode slugs (Fixes the "&" error)
    // We split by '/' just in case your slugs have nested paths, though usually they don't.
    const safeSlug = (slug: string) => {
        return slug.split('/').map(s => encodeURIComponent(s)).join('/');
    };

    // Product URLs
    products.forEach(p => {
        if (!p.slug) return;
        fields.push({
            // FIX applied here:
            loc: `${baseUrl}/${p.kind === 'AMMO' ? 'ammo' : 'firearms'}/${safeSlug(p.slug)}`,
            lastmod: p.updatedAt?.toISOString(),
            changefreq: 'daily',
            priority: 0.7,
        });
    });

    // Brand URLs
    brands.forEach(b => {
        if (!b.slug) return;
        // FIX applied here:
        const encodedSlug = safeSlug(b.slug);
        
        fields.push({
            loc: `${baseUrl}/ammo/${encodedSlug}`,
            changefreq: 'weekly',
            priority: 0.5,
        });
        fields.push({
            loc: `${baseUrl}/firearms/${encodedSlug}`,
            changefreq: 'weekly',
            priority: 0.5,
        });
    });

    // Caliber URLs
    calibers.forEach(c => {
        if (!c.slug) return;
        // FIX applied here:
        const encodedSlug = safeSlug(c.slug);

        fields.push({
            loc: `${baseUrl}/ammo/${encodedSlug}`,
            changefreq: 'weekly',
            priority: 0.6,
        });
        fields.push({
            loc: `${baseUrl}/firearms/${encodedSlug}`,
            changefreq: 'weekly',
            priority: 0.6,
        });
    });

    return getServerSideSitemap(fields);
}