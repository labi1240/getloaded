import { Suspense } from 'react';
import CategoryPage from '@/components/CategoryPage';
import { getProducts } from '@/lib/data';

async function FirearmList({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;

    // Parse filters
    const search = typeof params.q === 'string' ? params.q : undefined;
    const brandSlug = params.brands ? (Array.isArray(params.brands) ? params.brands : [params.brands]) : undefined;
    const caliberSlug = params.calibers ? (Array.isArray(params.calibers) ? params.calibers : [params.calibers]) : undefined;

    // Default InStock to TRUE unless explicitly 'false'
    const inStockParam = params.is;
    const inStock = inStockParam === undefined ? true : inStockParam === 'true';

    const products = await getProducts('FIREARM', 100, 0, {
        search,
        brandSlug,
        caliberSlug,
        inStock
    });

    return <CategoryPage kind="FIREARM" initialProducts={products} />;
}

export default function FirearmsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading Firearms...</div>}>
            <FirearmList searchParams={searchParams} />
        </Suspense>
    );
}
