import prisma  from '@/lib/prisma';
import { Product, Offer, Brand, Retailer, PriceHistoryPoint } from '../types';
import { Prisma } from '@prisma/client';
import { cacheLife, cacheTag } from 'next/cache';

// 1. Retailers (Static, Long Cache)
export async function getRetailers() {
  "use cache";
  cacheLife("days");

  const retailers = await prisma.retailer.findMany({
    orderBy: { name: 'asc' },
  });

  return retailers;
}

// 2. Offers (Dynamic/Short Cache - Prices change often)
export async function getOffers(itemId: string): Promise<Offer[]> {
    "use cache";
    cacheLife("hours"); 
    cacheTag(`offers-${itemId}`); // Keep tag if you plan to invalidate specific item offers

    const offers = await prisma.offer.findMany({
        where: { itemId },
        include: { Retailer: true },
        orderBy: { price: 'asc' }
    });

    return offers.map((offer) => ({
        id: offer.id,
        itemId: offer.itemId,
        retailerId: offer.retailerId,
        url: offer.url,
        inStock: offer.inStock || false,
        price: offer.price,
        shippingCost: offer.shippingCost || 0,
        total: offer.total || offer.price,
        shippingNote: offer.shippingNote,
        freeShipping: offer.freeShipping || false,
        retailer: {
            id: offer.Retailer.id,
            name: offer.Retailer.name,
            domain: offer.Retailer.domain,
            logo: offer.Retailer.logo
        },
        roundCount: offer.unitsCount || undefined,
        cpr: offer.cpr || undefined
    }));
}

// 3. Products List (Search/Filter)
export async function getProducts(
    kind: 'FIREARM' | 'AMMO' | 'ACCESSORY',
    limit = 100,
    skip = 0,
    filters?: {
        search?: string;
        brandSlug?: string[];
        caliberSlug?: string[];
        grain?: string[];
        inStock?: boolean;
        retailers?: string[];
    }
): Promise<Product[]> {
    "use cache";
    cacheLife("minutes"); // Cache search results briefly to handle high traffic

    const where: Prisma.CatalogItemWhereInput = {
        kind: kind,
    };

    // 1. Text Search
    if (filters?.search) {
        const search = filters.search.trim();
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { Brand: { name: { contains: search, mode: 'insensitive' } } },
            ];
        }
    }

    // 2. Filters
    if (filters?.brandSlug && filters.brandSlug.length > 0) {
        where.Brand = { slug: { in: filters.brandSlug } };
    }

    const offerCriteria: Prisma.OfferWhereInput = {};

    if (filters?.inStock) {
        offerCriteria.inStock = true;
    }

    if (filters?.retailers && filters.retailers.length > 0) {
        offerCriteria.Retailer = { name: { in: filters.retailers } };
    }

    if (Object.keys(offerCriteria).length > 0) {
        where.Offer = { some: offerCriteria };
    } else {
        where.offerCount = { gt: 0 };
    }

    // Handle Caliber and Grain
    if ((filters?.caliberSlug && filters.caliberSlug.length > 0) || (filters?.grain && filters.grain.length > 0)) {
        if (kind === 'FIREARM') {
            const firearmSpecsWhere: any = {};
            if (filters.caliberSlug && filters.caliberSlug.length > 0) {
                firearmSpecsWhere.FirearmChamber = {
                    some: {
                        Caliber: { slug: { in: filters.caliberSlug } }
                    }
                };
            }
            if (Object.keys(firearmSpecsWhere).length > 0) {
                where.FirearmSpecs = firearmSpecsWhere;
            }
        } else {
            const ammoSpecsWhere: any = {};
            if (filters.caliberSlug && filters.caliberSlug.length > 0) {
                ammoSpecsWhere.Caliber = { slug: { in: filters.caliberSlug } };
            }
            if (filters.grain && filters.grain.length > 0) {
                const validGrains = filters.grain.map(g => parseInt(g)).filter(n => !isNaN(n));
                if (validGrains.length > 0) {
                    ammoSpecsWhere.grain = { in: validGrains };
                }
            }
            if (Object.keys(ammoSpecsWhere).length > 0) {
                where.AmmoSpecs = ammoSpecsWhere;
            }
        }
    }

    const items = await prisma.catalogItem.findMany({
        where,
        take: limit,
        skip: skip,
        include: {
            Brand: true,
            Offer: {
                include: { Retailer: true },
                orderBy: { price: 'asc' }
            },
            FirearmSpecs: {
                include: {
                    FirearmChamber: { include: { Caliber: true } }
                }
            },
            AmmoSpecs: {
                include: { Caliber: true }
            },
            AccessorySpecs: true
        },
        orderBy: [
            { bestCpr: 'asc' },
            { bestPrice: 'asc' }
        ]
    });

    return items.map(mapToProduct);
}

// 4. Single Product (Static-ish)
export async function getProduct(id: string): Promise<Product | null> {
    "use cache";
    cacheLife("hours"); // Products don't change often, offers are fetched separately via getOffers if needed dynamic
    
    const item = await prisma.catalogItem.findUnique({
        where: { id },
        include: {
            Brand: true,
            Offer: {
                include: { Retailer: true },
                orderBy: { price: 'asc' }
            },
            FirearmSpecs: {
                include: {
                    FirearmChamber: { include: { Caliber: true } }
                }
            },
            AmmoSpecs: {
                include: { Caliber: true }
            }
        }
    });

    if (!item) return null;
    return mapToProduct(item);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    "use cache";
    cacheLife("hours");

    const item = await prisma.catalogItem.findUnique({
        where: { slug },
        include: {
            Brand: true,
            FirearmSpecs: {
                include: {
                    FirearmChamber: { include: { Caliber: true } }
                }
            },
            AmmoSpecs: {
                include: { Caliber: true }
            }
        }
    });

    if (!item) return null;
    return mapToProduct(item);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
    // No cache directive here usually, as this is often used for dynamic carts/comparisons
    // But you can add one if needed.
    if (!ids || ids.length === 0) return [];

    const items = await prisma.catalogItem.findMany({
        where: { id: { in: ids } },
        include: {
            Brand: true,
            Offer: {
                include: { Retailer: true },
                orderBy: { price: 'asc' }
            },
            FirearmSpecs: {
                include: {
                    FirearmChamber: { include: { Caliber: true } }
                }
            },
            AmmoSpecs: {
                include: { Caliber: true }
            }
        }
    });

    return items.map(mapToProduct);
}

// 5. Cross-Sells / Paired Items
export async function getPairedProduct(itemId: string): Promise<Product | null> {
    "use cache";
    cacheLife("hours");
    
    const item = await prisma.catalogItem.findUnique({
        where: { id: itemId },
        include: {
            FirearmSpecs: {
                include: {
                    FirearmChamber: { include: { Caliber: true } }
                }
            },
            AmmoSpecs: {
                include: { Caliber: true }
            }
        }
    });

    if (!item) return null;

    let caliberId: number | undefined;

    if (item.kind === 'FIREARM' && item.FirearmSpecs?.FirearmChamber?.[0]) {
        caliberId = item.FirearmSpecs.FirearmChamber[0].caliberId;
    } else if (item.kind === 'AMMO' && item.AmmoSpecs) {
        caliberId = item.AmmoSpecs.caliberId;
    }

    if (!caliberId) return null;

    const targetKind = item.kind === 'FIREARM' ? 'AMMO' : 'FIREARM';

    let pairedItem = await prisma.catalogItem.findFirst({
        where: {
            kind: targetKind,
            OR: [
                { AmmoSpecs: { caliberId: caliberId } },
                { FirearmSpecs: { FirearmChamber: { some: { caliberId: caliberId } } } }
            ],
            offerCount: { gt: 0 }
        },
        orderBy: [
            { bestPrice: 'asc' },
            { upvotes: 'desc' }
        ],
        include: {
            Brand: true,
            Offer: {
                include: { Retailer: true },
                orderBy: { price: 'asc' },
                take: 1
            },
            FirearmSpecs: {
                include: {
                    FirearmChamber: { include: { Caliber: true } }
                }
            },
            AmmoSpecs: {
                include: { Caliber: true }
            }
        }
    });

    // Fallback logic for combo calibers
    if (!pairedItem && caliberId) {
        const caliber = await prisma.caliber.findUnique({ where: { id: caliberId } });
        if (caliber && caliber.name) {
            const parts: string[] = caliber.name.split(/[,/]/).map(s => s.trim()).filter(Boolean);
            if (parts.length > 1) {
                const constituentCalibers = await prisma.caliber.findMany({
                    where: { name: { in: parts, mode: 'insensitive' } }
                });
                const constituentIds = constituentCalibers.map((c) => c.id);

                if (constituentIds.length > 0) {
                    pairedItem = await prisma.catalogItem.findFirst({
                        where: {
                            kind: targetKind,
                            OR: [
                                { AmmoSpecs: { caliberId: { in: constituentIds } } },
                                { FirearmSpecs: { FirearmChamber: { some: { caliberId: { in: constituentIds } } } } }
                            ],
                            offerCount: { gt: 0 }
                        },
                        orderBy: [
                            { bestPrice: 'asc' },
                            { upvotes: 'desc' }
                        ],
                        include: {
                            Brand: true,
                            Offer: {
                                include: { Retailer: true },
                                orderBy: { price: 'asc' },
                                take: 1
                            },
                            FirearmSpecs: {
                                include: {
                                    FirearmChamber: { include: { Caliber: true } }
                                }
                            },
                            AmmoSpecs: {
                                include: { Caliber: true }
                            }
                        }
                    });
                }
            }
        }
    }

    if (!pairedItem) return null;
    return mapToProduct(pairedItem);
}

// Helper Mapper
function mapToProduct(item: any): Product {
    const brand: Brand = {
        id: item.Brand?.id || 0,
        name: item.Brand?.name || 'Mixed Brand',
        slug: item.Brand?.slug || '',
        logo: item.Brand?.logo || null
    };

    const offers: Offer[] = (item.Offer || []).map((offer: any) => ({
        id: offer.id,
        itemId: offer.itemId,
        retailerId: offer.retailerId,
        url: offer.url,
        inStock: offer.inStock || false,
        price: offer.price,
        shippingCost: offer.shippingCost || 0,
        total: offer.total || offer.price,
        shippingNote: offer.shippingNote,
        freeShipping: offer.freeShipping || false,
        retailer: {
            id: offer.Retailer?.id || 0,
            name: offer.Retailer?.name || 'Mixed Retailer',
            domain: offer.Retailer?.domain || '',
            logo: offer.Retailer?.logo || null
        },
        roundCount: offer.unitsCount || undefined,
        cpr: offer.cpr || undefined
    }));

    const product: Product = {
        id: item.id,
        slug: item.slug,
        kind: item.kind,
        title: item.title,
        image: item.image || '/placeholder.jpg',
        brand: brand,
        offers: offers,
        priceHistory: []
    };

    if (item.kind === 'FIREARM' && item.FirearmSpecs) {
        const specs = item.FirearmSpecs;
        const caliber = specs.FirearmChamber?.[0]?.Caliber;

        product.caliber = caliber?.name || 'Unknown';
        product.caliberSlug = caliber?.slug;
        product.capacity = specs.capacity || undefined;
        product.barrelLength = specs.barrelLengthIn ? `${specs.barrelLengthIn}"` : undefined;
    } else if (item.kind === 'AMMO' && item.AmmoSpecs) {
        const specs = item.AmmoSpecs;

        product.grain = specs.grain || undefined;
        product.gauge = specs.gauge || undefined;
        product.casing = specs.casing || undefined;
        product.velocity = specs.velocity || undefined;
        product.type = specs.bulletType || undefined;
        product.caliber = specs.Caliber?.name || undefined;
        product.caliberSlug = specs.Caliber?.slug;
    }

    return product;
}

// 6. Validation Helpers (Long Cache)
export async function isValidCaliberSlug(slug: string): Promise<boolean> {
    "use cache";
    cacheLife("days");
    const count = await prisma.caliber.count({ where: { slug } });
    return count > 0;
}

export async function isValidBrandSlug(slug: string): Promise<boolean> {
    "use cache";
    cacheLife("days");
    const count = await prisma.brand.count({ where: { slug } });
    return count > 0;
}

// 7. Top Lists (Dashboard data)
export async function getTopBrands(limit = 8) {
    "use cache";
    cacheLife("days");
    try {
        const brands = await prisma.brand.findMany({
            take: limit,
            orderBy: { CatalogItem: { _count: 'desc' } },
            include: { _count: { select: { CatalogItem: true } } }
        });
        return brands;
    } catch (e) {
        console.error('Error fetching top brands:', e);
        return [];
    }
}

export async function getTopRetailers(limit = 6) {
    "use cache";
    cacheLife("days");
    try {
        const retailers = await prisma.retailer.findMany({
            take: limit,
            orderBy: { Offer: { _count: 'desc' } },
            include: { _count: { select: { Offer: true } } }
        });
        return retailers;
    } catch (e) {
        console.error('Error fetching top retailers:', e);
        return [];
    }
}

export async function getTopCalibers(
    type: 'handgun' | 'rifle' | 'shotgun' | 'rimfire',
    limit = 8
): Promise<{ name: string; slug: string; count: number }[]> {
    "use cache";
    cacheLife("days");

    const calibers = await prisma.caliber.findMany({
        where: {
            type: type,
            AmmoSpecs: { some: {} }
        },
        include: {
            _count: { select: { AmmoSpecs: true } }
        },
        orderBy: {
            AmmoSpecs: { _count: 'desc' }
        },
        take: limit
    });

    return calibers.map(c => ({
        name: c.name,
        slug: c.slug,
        count: c._count.AmmoSpecs
    }));
}

export async function getPriceHistory(itemId: string): Promise<PriceHistoryPoint[]> {
    "use cache";
    cacheLife("hours");

    try {
        const history = await prisma.$queryRaw<any[]>`
            SELECT 
                date_trunc('day', oh.time) as day,
                r.name as "retailerName",
                MIN(oh.price) as min_price,
                MIN(oh."unitPrice") as min_unit_price
            FROM "OfferHistory" oh
            JOIN "Offer" o ON oh."offerId" = o.id
            JOIN "Retailer" r ON o."retailerId" = r.id
            WHERE o."itemId" = ${itemId}
            GROUP BY day, r.name
            ORDER BY day ASC
        `;

        return history.map(point => ({
            time: point.day.toISOString(),
            price: Number(point.min_price),
            unitPrice: point.min_unit_price ? Number(point.min_unit_price) : undefined,
            retailerName: point.retailerName
        }));
    } catch (e) {
        console.error('Error fetching price history:', e);
        return [];
    }
}