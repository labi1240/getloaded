
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL not set');
        return;
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        console.log('Checking OfferHistory table...');
        const history = await prisma.$queryRaw`SELECT * FROM "OfferHistory" LIMIT 5`;
        console.log('OfferHistory sample:', history);

        const count = await prisma.$queryRaw`SELECT count(*) FROM "OfferHistory"`;
        console.log('Total OfferHistory records:', count);

        // Also check raw_offer_ingest
        const ingestCount = await prisma.$queryRaw`SELECT count(*) FROM "raw_offer_ingest"`;
        console.log('Total raw_offer_ingest records:', ingestCount);

    } catch (error) {
        console.error('Error querying database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
