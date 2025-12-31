import fs from 'fs';
import readline from 'readline';
import path from 'path';
import * as dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// ---------------------------------------------------------
// 👇 CRITICAL FIX: Import your existing configured instance
// ---------------------------------------------------------
// If this path is wrong, check where "prisma" is exported in your project!
// Try: '../lib/prisma' or '../src/lib/prisma' or '../prisma'
import prisma from '../lib/prisma'; 

const INPUT_FILE = process.argv[2] || 'gunengine_data_guns_2_r2.jsonl';

async function main() {
  console.log(`🚀 Starting Image-Only Update from ${INPUT_FILE}...`);
  
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ File not found: ${INPUT_FILE}`);
    process.exit(1);
  }

  const fileStream = fs.createReadStream(INPUT_FILE);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let processed = 0;
  let updated = 0;
  let skipped = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;
    
    try {
      const data = JSON.parse(line);

      // Validate
      if (!data.upc || !data.image) continue;

      // Filter for R2 links
      if (!data.image.includes('r2.dev') && !data.image.includes('ammometric')) {
        continue; 
      }

      // Update DB
      const result = await prisma.catalogItem.updateMany({
        where: { upc: data.upc },
        data: { image: data.image }
      });

      if (result.count > 0) {
        updated += result.count;
      } else {
        skipped++;
      }

    } catch (e) {
      // Ignore parse errors
    }

    processed++;
    if (processed % 500 === 0) {
      process.stdout.write(`Processed: ${processed} | Updated: ${updated} | Skipped: ${skipped} \r`);
    }
  }

  console.log(`\n\n✅ Complete!`);
  console.log(`Total Scanned: ${processed}`);
  console.log(`DB Rows Updated: ${updated}`);
  console.log(`Items Skipped (Not in DB): ${skipped}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    // Usually we disconnect, but if we import the singleton, 
    // we might want to leave it or handle it carefully.
    // await prisma.$disconnect(); 
  });