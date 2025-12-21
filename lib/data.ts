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
        include: { retailer: true },
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
            id: offer.retailer.id,
            name: offer.retailer.name,
            domain: offer.retailer.domain,
            logo: offer.retailer.logo
        },
        roundCount: offer.unitsCount || undefined,
        cpr: offer.totalUnitPrice || (offer.unitsCount && offer.unitsCount > 0 ? offer.price / offer.unitsCount : undefined)
    }));
}


export async function getProducts(
    kind: 'FIREARM' | 'AMMO',
    limit = 50,
    skip = 0,
    filters?: {
        brandSlug?: string;
        caliberSlug?: string;
        grain?: number;
    }
): Promise<Product[]> {
    "use cache"
    cacheLife("minutes")
    // Update cache tag to include filters
    const filterKey = filters ? `-${filters.brandSlug || 'all'}-${filters.caliberSlug || 'all'}-${filters.grain || 'all'}` : '';
    cacheTag(`products-${kind.toLowerCase()}${filterKey}`)

    const where: Prisma.CatalogItemWhereInput = {
        kind: kind,
        offerCount: { gt: 0 }
    };

    if (filters?.brandSlug) {
        where.Brand = { slug: filters.brandSlug };
    }

    // Handle Caliber and Grain filters
    if (filters?.caliberSlug || filters?.grain) {
        if (kind === 'FIREARM') {
            // For firearms, check FirearmSpecs -> FirearmChamber -> Caliber
            const firearmSpecsWhere: any = {};

            if (filters.caliberSlug) {
                firearmSpecsWhere.FirearmChamber = {
                    some: {
                        Caliber: { slug: filters.caliberSlug }
                    }
                };
            }
            // Firearms typically don't have 'grain' but if schema supports it validation logic goes here

            where.FirearmSpecs = firearmSpecsWhere;

        } else {
            // For ammo, check AmmoSpecs -> Caliber AND/OR Grain
            const ammoSpecsWhere: any = {};

            if (filters.caliberSlug) {
                ammoSpecsWhere.Caliber = { slug: filters.caliberSlug };
            }

            if (filters.grain) {
                ammoSpecsWhere.grain = filters.grain;
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
                    retailer: true
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
        orderBy: {
            bestPrice: 'asc' // Sort by best price ascending
        }
    });

    return items.map(mapToProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
    "use cache"
    cacheLife("minutes")
    const item = await prisma.catalogItem.findUnique({
        where: { id },
        include: {
            Brand: true,
            Offer: {
                include: {
                    retailer: true
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
    "use cache"
    cacheLife("max")
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
    "use cache"
    cacheLife("minutes")
    if (!ids || ids.length === 0) return [];

    const items = await prisma.catalogItem.findMany({
        where: {
            id: { in: ids }
        },
        include: {
            Brand: true,
            Offer: {
                include: {
                    retailer: true
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
    "use cache"
    cacheLife("minutes")

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
                    retailer: true
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
                                    retailer: true
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
        name: item.Brand?.name || 'Unknown Brand',
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
            id: offer.retailer.id,
            name: offer.retailer.name,
            domain: offer.retailer.domain,
            logo: offer.retailer.logo
        },
        roundCount: offer.unitsCount || undefined,
        cpr: offer.totalUnitPrice || (offer.unitsCount && offer.unitsCount > 0 ? offer.price / offer.unitsCount : undefined)
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
    "use cache"
    cacheLife("days")
    const count = await prisma.caliber.count({
        where: { slug }
    });
    return count > 0;
}

export async function isValidBrandSlug(slug: string): Promise<boolean> {
    "use cache"
    cacheLife("days")
    const count = await prisma.brand.count({
        where: { slug }
    });
    return count > 0;
}
