import { Suspense } from 'react';
import CategoryPage from '@/components/CategoryPage';
import { getProducts } from '@/lib/data';

async function FirearmList() {
    const products = await getProducts('FIREARM');
    return <CategoryPage kind="FIREARM" initialProducts={products} />;
}

export default function FirearmsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading Firearms...</div>}>
            <FirearmList />
        </Suspense>
    );
}
