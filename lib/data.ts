import prisma from './prisma';
import { Product, Offer, Brand, Retailer } from '../types';
import { cacheLife, cacheTag } from 'next/cache';
import { Prisma } from '@prisma/client';

export async function getRetailers(): Promise<Retailer[]> {
    "use cache"
    cacheLife("days")
    const retailers = await prisma.retailer.findMany({
        orderBy: { name: 'asc' }
    });
    return retailers.map((r) => ({
        id: r.id,
        name: r.name,
        domain: r.domain,
        logo: r.logo || null
    }));
}


export async function getOffers(itemId: string): Promise<Offer[]> {
    // "use cache"
    // cacheLife("hours")
    // cacheTag(`offers-${itemId}`)
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
        cpr: offer.cpr || undefined // Use direct DB value (mapped from unitPrice)
    }));
}


export async function getProducts(
    kind: 'FIREARM' | 'AMMO',
    limit = 100,
    skip = 0,
    filters?: {
        search?: string;
        brandSlug?: string[];
        caliberSlug?: string[];
        grain?: string[];
        inStock?: boolean;
    }
): Promise<Product[]> {
    // "use cache"
    // cacheLife("minutes")

    // Create a cache tag that uniquely identifies this query
    // const filterKey = JSON.stringify(filters || {});
    // cacheTag(`products-${kind.toLowerCase()}-${Buffer.from(filterKey).toString('base64')}`);

    const where: Prisma.CatalogItemWhereInput = {
        kind: kind,
    };

    // 1. Text Search (Title, Brand Name, Caliber Name via Alias/Slug)
    if (filters?.search) {
        const search = filters.search.trim();
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { Brand: { name: { contains: search, mode: 'insensitive' } } },
                // Note: Searching deep relations like Caliber Name in top-level OR is tricky in Prisma 
                // without overly complex queries. Usually Title contains caliber info.
                // We'll stick to Title and Brand + potentially slug partials for now.
            ];
        }
    }

    // 2. Filters
    if (filters?.brandSlug && filters.brandSlug.length > 0) {
        where.Brand = { slug: { in: filters.brandSlug } };
    }

    // Handle In Stock
    if (filters?.inStock) {
        // Must have at least one In Stock offer
        where.Offer = {
            some: {
                inStock: true
            }
        };
    } else {
        // Default behavior: Must have at least one offer (in stock or not)
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
            where.FirearmSpecs = firearmSpecsWhere;
        } else {
            const ammoSpecsWhere: any = {};
            if (filters.caliberSlug && filters.caliberSlug.length > 0) {
                ammoSpecsWhere.Caliber = { slug: { in: filters.caliberSlug } };
            }
            if (filters.grain && filters.grain.length > 0) {
                // Cast grain strings to int only if valid numbers
                const validGrains = filters.grain.map(g => parseInt(g)).filter(n => !isNaN(n));
                if (validGrains.length > 0) {
                    ammoSpecsWhere.grain = { in: validGrains };
                }
            }
            where.AmmoSpecs = ammoSpecsWhere;
        }
    }

    const items = await prisma.catalogItem.findMany({
        where,
        take: limit,
        skip: skip,
        include: {
            Brand: true,
            Offer: {
                include: {
                    Retailer: true
                },
                // If In Stock filter is on, we might want to prioritize in-stock offers in the returned structure?
                // But the Requirement is about LISTING products.
                orderBy: {
                    price: 'asc'
                }
            },
            FirearmSpecs: {
                include: {
                    FirearmChamber: {
                        include: {
                            Caliber: true
                        }
                    }
                }
            },
            AmmoSpecs: {
                include: {
                    Caliber: true
                }
            }
        },
        orderBy: [
            // Requirement: Default Sort Price Per Round.
            // prioritize in-stock if mixed? The requirement just says "Sort Order ... Price Per Round"
            { bestCpr: 'asc' },
            { bestPrice: 'asc' } // Fallback
        ]
    });

    return items.map(mapToProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
    // "use cache"
    // cacheLife("minutes")
    const item = await prisma.catalogItem.findUnique({
        where: { id },
        include: {
            Brand: true,
            Offer: {
                include: {
                    Retailer: true
                },
                orderBy: {
                    price: 'asc'
                }
            },
            FirearmSpecs: {
                include: {
                    FirearmChamber: {
                        include: {
                            Caliber: true
                        }
                    }
                }
            },
            AmmoSpecs: {
                include: {
                    Caliber: true
                }
            }
        }
    });

    if (!item) return null;

    return mapToProduct(item);
}


export async function getProductBySlug(slug: string): Promise<Product | null> {
    // "use cache"
    // cacheLife("max")
    const item = await prisma.catalogItem.findUnique({
        where: { slug },
        include: {
            Brand: true,
            // Offer removed to allow separate caching (dynamic vs static)
            FirearmSpecs: {
                include: {
                    FirearmChamber: {
                        include: {
                            Caliber: true
                        }
                    }
                }
            },
            AmmoSpecs: {
                include: {
                    Caliber: true
                }
            }
        }
    });

    if (!item) return null;

    return mapToProduct(item);
}


export async function getProductsByIds(ids: string[]): Promise<Product[]> {

    if (!ids || ids.length === 0) return [];

    const items = await prisma.catalogItem.findMany({
        where: {
            id: { in: ids }
        },
        include: {
            Brand: true,
            Offer: {
                include: {
                    Retailer: true
                },
                orderBy: {
                    price: 'asc'
                }
            },
            FirearmSpecs: {
                include: {
                    FirearmChamber: {
                        include: {
                            Caliber: true
                        }
                    }
                }
            },
            AmmoSpecs: {
                include: {
                    Caliber: true
                }
            }
        }
    });

    return items.map(mapToProduct);
}


export async function getPairedProduct(itemId: string): Promise<Product | null> {
    // "use cache"
    // cacheLife("minutes")

    // 1. Get the item to determine its type and specs
    const item = await prisma.catalogItem.findUnique({
        where: { id: itemId },
        include: {
            FirearmSpecs: {
                include: {
                    FirearmChamber: {
                        include: {
                            Caliber: true
                        }
                    }
                }
            },
            AmmoSpecs: {
                include: {
                    Caliber: true
                }
            }
        }
    });

    if (!item) return null;

    let caliberId: number | undefined;

    // Determine caliber based on item type
    if (item.kind === 'FIREARM' && item.FirearmSpecs && item.FirearmSpecs.FirearmChamber && item.FirearmSpecs.FirearmChamber.length > 0) {
        caliberId = item.FirearmSpecs.FirearmChamber[0].caliberId;
    } else if (item.kind === 'AMMO' && item.AmmoSpecs) {
        caliberId = item.AmmoSpecs.caliberId;
    }

    if (!caliberId) return null;

    // 2. Find best pairing matching this caliber
    // If input is Firearm, look for Ammo. If input is Ammo, look for Firearm.
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
            { bestPrice: 'asc' }, // Best value
            { upvotes: 'desc' } // Most popular
        ],
        include: {
            Brand: true,
            Offer: {
                include: {
                    Retailer: true
                },
                orderBy: {
                    price: 'asc'
                },
                take: 1
            },
            FirearmSpecs: {
                include: {
                    FirearmChamber: {
                        include: {
                            Caliber: true
                        }
                    }
                }
            },
            AmmoSpecs: {
                include: {
                    Caliber: true
                }
            }
        }
    });

    // Smart Fallback: If no direct match is found, check for "combo" calibers
    // e.g. Firearm is "45 Long Colt, 410 Bore" (ID=373) -> match Ammo "45 Long Colt" (ID=35)
    if (!pairedItem && caliberId) {
        // Fetch the caliber name of the original item
        const caliber = await prisma.caliber.findUnique({
            where: { id: caliberId }
        });

        if (caliber && caliber.name) {
            // Updated split regex to handle commas and slashes
            const parts: string[] = caliber.name.split(/[,/]/).map(s => s.trim()).filter(Boolean);

            if (parts.length > 1) {
                // Find IDs for these constituent caliber names
                // We use findMany because the names might not be unique (though ideally they are)
                const constituentCalibers = await prisma.caliber.findMany({
                    where: {
                        name: { in: parts, mode: 'insensitive' }
                    }
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
                                include: {
                                    Retailer: true
                                },
                                orderBy: {
                                    price: 'asc'
                                },
                                take: 1
                            },
                            FirearmSpecs: {
                                include: {
                                    FirearmChamber: {
                                        include: {
                                            Caliber: true
                                        }
                                    }
                                }
                            },
                            AmmoSpecs: {
                                include: {
                                    Caliber: true
                                }
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


function mapToProduct(item: any): Product {
    // Map Brand
    const brand: Brand = {
        id: item.Brand?.id || 0,
        name: item.Brand?.name || 'Mixed Brand',
        slug: item.Brand?.slug || '',
        logo: item.Brand?.logo || null
    };

    // Map Offers
    const offers: Offer[] = (item.Offer || []).map((offer: any) => ({
        id: offer.id,
        itemId: offer.itemId,
        retailerId: offer.retailerId,
        url: offer.url,
        inStock: offer.inStock || false,
        price: offer.price,
        shippingCost: offer.shippingCost || 0,
        total: offer.total || offer.price, // Fallback
        shippingNote: offer.shippingNote,
        freeShipping: offer.freeShipping || false,
        retailer: {
            id: offer.Retailer?.id || 0,
            name: offer.Retailer?.name || 'Mixed Retailer',
            domain: offer.Retailer?.domain || '',
            logo: offer.Retailer?.logo || null
        },
        roundCount: offer.unitsCount || undefined,
        // roundCount: offer.unitsCount || undefined,
        cpr: offer.cpr || undefined // Use direct DB value (mapped from unitPrice)
    }));

    // Common Product Fields
    const product: Product = {
        id: item.id,
        slug: item.slug, // Map slug
        kind: item.kind === 'FIREARM' ? 'FIREARM' : 'AMMO',
        title: item.title,
        image: item.image || '/placeholder.jpg',
        brand: brand,
        offers: offers,
        priceHistory: [] // TODO: Implement if needed
    };

    // Specs Mapping
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
        product.gauge = specs.gauge || undefined; // Added this line
        product.casing = specs.casing || undefined;
        product.velocity = specs.velocity || undefined;
        product.type = specs.bulletType || undefined;
        product.caliber = specs.Caliber?.name || undefined;
        product.caliberSlug = specs.Caliber?.slug;
    }

    return product;
}

export async function isValidCaliberSlug(slug: string): Promise<boolean> {
    // "use cache"
    // cacheLife("days")
    const count = await prisma.caliber.count({
        where: { slug }
    });
    return count > 0;
}

export async function isValidBrandSlug(slug: string): Promise<boolean> {
    // "use cache"
    // cacheLife("days")
    const count = await prisma.brand.count({
        where: { slug }
    });
    return count > 0;
}
