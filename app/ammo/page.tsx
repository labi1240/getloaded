import { Suspense } from 'react';
import CategoryPage from '@/components/CategoryPage';
import { getProducts } from '@/lib/data';


async function AmmoList({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;

    // Parse filters
    const search = typeof params.q === 'string' ? params.q : undefined;
    const brandSlug = params.brands ? (Array.isArray(params.brands) ? params.brands : [params.brands]) : undefined;
    const caliberSlug = params.calibers ? (Array.isArray(params.calibers) ? params.calibers : [params.calibers]) : undefined;
    const grain = params.grains ? (Array.isArray(params.grains) ? params.grains : [params.grains]) : undefined;
    const retailers = params.retailers ? (Array.isArray(params.retailers) ? params.retailers : [params.retailers]) : undefined;

    // Default InStock to TRUE unless explicitly 'false'
    const inStockParam = params.is;
    const inStock = inStockParam === undefined ? true : inStockParam === 'true';

    const products = await getProducts('AMMO', 100, 0, {
        search,
        brandSlug,
        caliberSlug,
        grain,
        inStock,
        retailers
    });

    return <CategoryPage kind="AMMO" initialProducts={products} />;
}

export default function AmmoPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading Ammo...</div>}>
            <AmmoList searchParams={searchParams} />
        </Suspense>
    );
}
