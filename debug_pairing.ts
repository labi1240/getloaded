import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
console.log("DB URL:", connectionString ? connectionString.replace(/:[^:]*@/, ':***@') : "UNDEFINED");
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("--- Debugging Firearm Pairing ---");

    // 1. Find a Firearm that has a chamber
    const slug = 'italian-firearms-group-l641410-45-long-colt-410-bore-802987403190';
    const firearm = await prisma.catalogItem.findUnique({
        where: { slug },
        include: {
            FirearmSpecs: {
                include: {
                    FirearmChamber: {
                        include: {
                            Caliber: true
                        }
                    }
                }
            }
        }
    });

    if (!firearm) {
        console.log("Firearm not found for slug:", slug);
        return;
    }

    console.log(`Found Firearm: ${firearm.title} (${firearm.id})`);

    const chambers = firearm.FirearmSpecs?.FirearmChamber || [];
    console.log(`Chambers count: ${chambers.length}`);

    for (const chamber of chambers) {
        console.log(`- Chamber Caliber ID: ${chamber.caliberId}, Name: ${chamber.Caliber?.name}`);
    }

    const caliberId = chambers[0]?.caliberId;

    // Search for constituent calibers
    console.log("\nChecking for constituent calibers...");
    const name = chambers[0]?.Caliber?.name || "";
    const parts = name.split(',').map(s => s.trim());

    for (const part of parts) {
        console.log(`Searching for caliber name: "${part}"`);
        const cals = await prisma.caliber.findMany({
            where: { name: { contains: part, mode: 'insensitive' } }
        });
        for (const c of cals) {
            console.log(`- Found Caliber: ID ${c.id}, Name: ${c.name}`);
            // Check if ammo exists for this ID
            const ammoCount = await prisma.catalogItem.count({
                where: {
                    kind: 'AMMO',
                    AmmoSpecs: { caliberId: c.id },
                    offerCount: { gt: 0 }
                }
            });
            console.log(`  - Active Ammo Count: ${ammoCount}`);
        }
    }



    // 2. Try to find Ammo for this caliber
    console.log("\nSearching for Ammo...");
    const ammo = await prisma.catalogItem.findFirst({
        where: {
            kind: 'AMMO',
            AmmoSpecs: {
                caliberId: caliberId
            },
            offerCount: { gt: 0 }
        },
        include: {
            Offer: true
        }
    });

    if (ammo) {
        console.log(`FOUND Match: ${ammo.title}`);
        console.log(`Offers: ${ammo.Offer.length}`);
    } else {
        console.log(`NO Match found (with offerCount > 0).`);

        // Check if ANY match exists regardless of active offers
        const ammoAny = await prisma.catalogItem.findFirst({
            where: {
                kind: 'AMMO',
                AmmoSpecs: {
                    caliberId: caliberId
                }
            }
        });
        if (ammoAny) {
            console.log(`...but found an ammo item without offers: ${ammoAny.title} (OfferCount: ${ammoAny.offerCount})`);
        } else {
            console.log(`...and NO ammo item found in DB for caliber ${caliberId}.`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
