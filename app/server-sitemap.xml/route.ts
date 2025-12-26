
import { getServerSideSitemap } from 'next-sitemap'
import prisma from '@/lib/prisma'
import { ISitemapField } from 'next-sitemap'

export async function GET(request: Request) {
    // 1. Fetch Products (Limit to recent/popular if too many, or stream? For now fetch all slugs)
    // Warning: If there are 10k+ items, this might be slow. 
    const products = await prisma.catalogItem.findMany({
        select: {
            slug: true,
            kind: true,
            updatedAt: true
        }
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
    const baseUrl = process.env.SITE_URL || 'https://getloaded.vercel.app';

    // Product URLs
    products.forEach(p => {
        if (!p.slug) return;
        fields.push({
            loc: `${baseUrl}/${p.kind === 'AMMO' ? 'ammo' : 'firearms'}/${p.slug}`,
            lastmod: p.updatedAt?.toISOString(),
            changefreq: 'daily',
            priority: 0.7,
        });
    });

    // Brand URLs (Generate for both categories for now, or refine later)
    brands.forEach(b => {
        if (!b.slug) return;
        // Ammo Brand Page
        fields.push({
            loc: `${baseUrl}/ammo/${b.slug}`,
            changefreq: 'weekly',
            priority: 0.5,
        });
        // Firearm Brand Page
        fields.push({
            loc: `${baseUrl}/firearms/${b.slug}`,
            changefreq: 'weekly',
            priority: 0.5,
        });
    });

    // Caliber URLs
    calibers.forEach(c => {
        if (!c.slug) return;
        fields.push({
            loc: `${baseUrl}/ammo/${c.slug}`,
            changefreq: 'weekly',
            priority: 0.6,
        });
        fields.push({
            loc: `${baseUrl}/firearms/${c.slug}`,
            changefreq: 'weekly',
            priority: 0.6,
        });
    });

    return getServerSideSitemap(fields);
}
