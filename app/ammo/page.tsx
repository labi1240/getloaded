import { Suspense } from 'react';
import CategoryPage from '@/components/CategoryPage';
import { getProducts } from '@/lib/data';


async function AmmoList() {
    const products = await getProducts('AMMO');
    return <CategoryPage kind="AMMO" initialProducts={products} />;
}

export default function AmmoPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading Ammo...</div>}>
            <AmmoList />
        </Suspense>
    );
}
