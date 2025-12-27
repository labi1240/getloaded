import fs from 'fs';
import path from 'path';

const LOGOS = [
    // RETAILERS
    { name: 'True Shot Gun Club', url: 'https://www.cdn.bulkcheapammo.com/assets/images/true-shot.webp', filename: 'retailer-true-shot.webp' },
    { name: 'Palmetto State Armory', url: 'https://www.cdn.bulkcheapammo.com/assets/images/palmetto-state.webp', filename: 'retailer-palmetto-state.webp' },
    { name: 'Firearms Depot', url: 'https://www.cdn.bulkcheapammo.com/assets/images/firearms-depot.webp', filename: 'retailer-firearms-depot.webp' },
    { name: 'Outdoor Limited', url: 'https://www.cdn.bulkcheapammo.com/assets/images/outdoor-limited.webp', filename: 'retailer-outdoor-limited.webp' },
    { name: 'Guns Com', url: 'https://www.cdn.bulkcheapammo.com/assets/images/guns-com.webp', filename: 'retailer-guns-com.webp' },
    { name: 'GrabAGun', url: 'https://www.cdn.bulkcheapammo.com/assets/images/grabagun.webp', filename: 'retailer-grabagun.webp' },
    { name: 'Global Ordnance', url: 'https://www.cdn.bulkcheapammo.com/assets/images/global-ordnance.webp', filename: 'retailer-global-ordnance.webp' },
    { name: 'Bereli', url: 'https://www.cdn.bulkcheapammo.com/assets/images/bereli.webp', filename: 'retailer-bereli.webp' },
    { name: 'Federal Premium', url: 'https://www.cdn.bulkcheapammo.com/assets/images/federal-premium.webp', filename: 'retailer-federal-premium.webp' },
    { name: 'Sportsman Guide', url: 'https://www.cdn.bulkcheapammo.com/assets/images/sportsman-guide.webp', filename: 'retailer-sportsman-guide.webp' },
    { name: 'AR15 Discounts', url: 'https://www.cdn.bulkcheapammo.com/assets/images/ar-15-discounts.webp', filename: 'retailer-ar-15-discounts.webp' },
    { name: 'Ammo Com', url: 'https://www.cdn.bulkcheapammo.com/assets/images/ammo-com.webp', filename: 'retailer-ammo-com.webp' },

    // BRANDS
    { name: 'Aguila Ammo', url: 'https://www.cdn.bulkcheapammo.com/assets/images/aguila-brand.webp', filename: 'brand-aguila.webp' },
    { name: 'Federal Ammo', url: 'https://www.cdn.bulkcheapammo.com/assets/images/federal.webp', filename: 'brand-federal.webp' },
    { name: 'Wolf Ammo', url: 'https://www.cdn.bulkcheapammo.com/assets/images/wolf.webp', filename: 'brand-wolf.webp' },
    { name: 'Precision Ammo', url: 'https://www.cdn.bulkcheapammo.com/assets/images/precision.webp', filename: 'brand-precision.webp' },
    { name: 'Armscor Ammo', url: 'https://www.cdn.bulkcheapammo.com/assets/images/armscor.webp', filename: 'brand-armscor.webp' },
    { name: 'Winchester Ammo', url: 'https://www.cdn.bulkcheapammo.com/assets/images/winchester-brand.webp', filename: 'brand-winchester.webp' },
    { name: 'Liberty Ammo', url: 'https://www.cdn.bulkcheapammo.com/assets/images/liberty-brand.webp', filename: 'brand-liberty.webp' },
    { name: 'Prvi Partizan Ammo', url: 'https://www.cdn.bulkcheapammo.com/assets/images/prvi-partizan.webp', filename: 'brand-prvi-partizan.webp' },
    { name: 'Buffalo Bore Ammo', url: 'https://www.cdn.bulkcheapammo.com/assets/images/buffalo-bore-ammo.webp', filename: 'brand-buffalo-bore.webp' },
    { name: 'Underwood Ammo', url: 'https://www.cdn.bulkcheapammo.com/assets/images/underwood-ammo.webp', filename: 'brand-underwood.webp' },
    { name: 'Tula Ammo', url: 'https://www.cdn.bulkcheapammo.com/assets/images/tula-amoo.webp', filename: 'brand-tula.webp' },
    { name: 'Norma Ammo', url: 'https://www.cdn.bulkcheapammo.com/assets/images/norma-ammo.webp', filename: 'brand-norma.webp' },
];

async function downloadLogos() {
    const outputDir = path.join(process.cwd(), 'public/logos');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`Downloading ${LOGOS.length} logos to ${outputDir}...`);

    for (const item of LOGOS) {
        console.log(`Downloading ${item.name}...`);
        try {
            const response = await fetch(item.url);
            if (!response.ok) {
                console.error(`Failed to fetch ${item.url}: ${response.statusText}`);
                continue;
            }

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const outputPath = path.join(outputDir, item.filename);

            fs.writeFileSync(outputPath, buffer);
            console.log(`Saved to ${item.filename}`);
        } catch (error) {
            console.error(`Error downloading ${item.name}:`, error);
        }
    }
}

downloadLogos().catch(console.error);
