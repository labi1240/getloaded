
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
    console.log('Checking 9mm items bestCpr...');

    // Find "9mm" caliber slug id first or just search text
    // We'll just search for "9mm" in title as per the user's screenshot context

    const items = await prisma.catalogItem.findMany({
        where: {
            kind: 'AMMO',
            title: { contains: '9mm', mode: 'insensitive' },
            offerCount: { gt: 0 }
        },
        select: {
            id: true,
            title: true,
            bestCpr: true,
            bestPrice: true,
            Offer: {
                take: 1,
                orderBy: { price: 'asc' },
                select: {
                    price: true,
                    totalUnitPrice: true,
                    unitsCount: true
                }
            }
        },
        orderBy: {
            bestCpr: 'asc'
        },
        take: 10
    });

    console.log(`Found ${items.length} items. Top 10 sorted by bestCpr ASC:`);
    items.forEach(item => {
        console.log(`[${item.id}] CPR:${item.bestCpr} Price:${item.bestPrice} Title:${item.title.substring(0, 30)}...`);
        if (item.Offer.length) {
            console.log(`   BestOffer: Price:${item.Offer[0].price} UnitPrice:${item.Offer[0].totalUnitPrice} Count:${item.Offer[0].unitsCount}`);
        }
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
