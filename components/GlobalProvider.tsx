'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

import { Retailer, Product } from '../types';

interface GlobalContextType {
    blockedRetailers: string[];
    toggleBlockRetailer: (retailerName: string) => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    compareIds: string[];
    setCompareIds: (ids: string[]) => void;
    toggleCompare: (id: string) => void;
    firearmFilters: any;
    setFirearmFilters: (f: any) => void;
    ammoFilters: any;
    setAmmoFilters: (f: any) => void;
    allRetailers: Retailer[];
    setAllRetailers: (retailers: Retailer[]) => void;
    allProducts: Product[];
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children, initialRetailers = [] }: { children: React.ReactNode; initialRetailers?: Retailer[] }) {
    const [blockedRetailers, setBlockedRetailers] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [compareIds, setCompareIds] = useState<string[]>([]);

    // Hydration State for Retailers
    const [allRetailers, setAllRetailers] = useState<Retailer[]>(initialRetailers);

    // Faceted Filter State
    const [firearmFilters, setFirearmFilters] = useState<any>({});
    const [ammoFilters, setAmmoFilters] = useState<any>({});

    const toggleBlockRetailer = (retailerName: string) => {
        setBlockedRetailers(prev =>
            prev.includes(retailerName)
                ? prev.filter(n => n !== retailerName)
                : [...prev, retailerName]
        );
    };

    const toggleCompare = (id: string) => {
        setCompareIds(prev =>
            prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id].slice(-4)
        );
    };

    const allProducts: Product[] = []; // Deprecated usage of allProducts in context


    const value = {
        blockedRetailers,
        toggleBlockRetailer,
        searchQuery,
        setSearchQuery,
        compareIds,
        setCompareIds,
        toggleCompare,
        firearmFilters,
        setFirearmFilters,
        ammoFilters,
        setAmmoFilters,
        allRetailers,
        setAllRetailers,
        allProducts,
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobal() {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
}
