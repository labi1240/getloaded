'use server';

import * as data from './data';
import { Product } from '../types';

/**
 * Server Actions for Client Components
 * These act as a public gateway to the internal data layer.
 */

export async function getProducts(kind: 'FIREARM' | 'AMMO', limit = 50, skip = 0): Promise<Product[]> {
    return data.getProducts(kind, limit, skip);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
    return data.getProductsByIds(ids);
}
