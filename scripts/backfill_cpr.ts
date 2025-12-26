
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Starting CPR Backfill...');

    // Process in batches
    const batchSize = 100;
    let skip = 0;
    let processed = 0;
    let updated = 0;

    while (true) {
        const items = await prisma.catalogItem.findMany({
            where: {
                // Only items that need update? Or force all?
                // Let's force all with offers to ensure sync.
                offerCount: { gt: 0 }
            },
            include: {
                Offer: {
                    where: { inStock: true }, // Calculate best CPR from IN STOCK offers? 
                    // User said "Default 'In Stock' State: TRUE".
                    // But `bestCpr` generic field usually implies "Best Available".
                    // If no in-stock, maybe best overall?
                    // Let's grab all offers but prioritize stock if we were smart, 
                    // but usually `bestCpr` is simply min(cpr) of valid offers.
                    select: {
                        price: true,
                        unitsCount: true,
                        totalUnitPrice: true, // Use this if exists
                        inStock: true
                    }
                }
            },
            take: batchSize,
            skip: skip
        });

        if (items.length === 0) break;

        for (const item of items) {
            let bestCpr = 999999;
            let bestPrice = 999999;
            let foundCpr = false;

            // Strategy: 
            // 1. Calculate CPR for each offer.
            // 2. Find min CPR across ALL offers (or just in-stock?).
            //    Standard practice: Best CPR is usually min(CPR) of In-Stock items. 
            //    If no In-Stock items, min(CPR) of OOS items (or remain null/high?).
            //    Let's track both: minInStockCpr and minOverallCpr.

            // Actually, let's keep it simple: Best CPR is valid CPR.

            let offers = item.Offer;

            // Prefer in-stock offers?
            const inStockOffers = offers.filter(o => o.inStock);
            const targetOffers = inStockOffers.length > 0 ? inStockOffers : offers;

            if (targetOffers.length > 0) {
                for (const offer of targetOffers) {
                    let cpr = offer.totalUnitPrice;
                    if (!cpr && offer.unitsCount && offer.unitsCount > 0) {
                        cpr = offer.price / offer.unitsCount;
                    }

                    if (cpr !== null && cpr !== undefined && cpr > 0) {
                        if (cpr < bestCpr) {
                            bestCpr = cpr;
                            foundCpr = true;
                        }
                    }

                    if (offer.price < bestPrice) {
                        bestPrice = offer.price;
                    }
                }
            }

            // Update if changed
            const finalCpr = foundCpr ? bestCpr : null;
            const finalPrice = bestPrice !== 999999 ? bestPrice : null;

            if (item.bestCpr !== finalCpr || item.bestPrice !== finalPrice) {
                await prisma.catalogItem.update({
                    where: { id: item.id },
                    data: {
                        bestCpr: finalCpr,
                        bestPrice: finalPrice
                    }
                });
                updated++;
            }
        }

        processed += items.length;
        skip += items.length;
        console.log(`Processed ${processed} items. Updated ${updated}.`);
    }

    console.log('Backfill complete.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
