
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const ids = [
        '78543a28-f722-5533-ae56-15b5dce3df28',
        '31a9d0ce-8ce8-58f7-a4e5-989a2746a011'
    ];

    const items = await prisma.catalogItem.findMany({
        where: { id: { in: ids } },
        select: { id: true, title: true, bestCpr: true }
    });

    console.log('Verification Results:');
    items.forEach(item => {
        console.log(`[${item.id}] ${item.title.substring(0, 20)}... CPR: ${item.bestCpr}`);
    });
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
