'use client';

import { useEffect } from 'react';
import { useGlobal } from './GlobalProvider';
import { Retailer } from '../types';

export default function RetailerHydrator({ retailers }: { retailers: Retailer[] }) {
    const { setAllRetailers } = useGlobal();

    useEffect(() => {
        setAllRetailers(retailers);
    }, [retailers, setAllRetailers]);

    return null;
}
