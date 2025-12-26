import { JSDOM } from 'jsdom'; // If available, else Regex

// Regex is safer given no JSDOM in package.json
export interface ExternalOffer {
    price: number;
    cpr?: number;
    retailer: string;
    url: string;
    inStock: boolean;
}

export function parseExternalHtml(html: string): ExternalOffer[] {
    const offers: ExternalOffer[] = [];
    // Split by offer div to handle multiple offers
    const infoBlocks = html.split(/<div class="offer /);

    for (const block of infoBlocks) {
        if (!block.trim()) continue;

        // Extract Price
        const priceMatch = block.match(/class="offer-price__value">\s*\$([\d,.]+)/);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;

        // Extract CPR
        const cprMatch = block.match(/class="offer-price__per-round">\s*\$([\d,.]+)\/rd/);
        const cpr = cprMatch ? parseFloat(cprMatch[1].replace(/,/g, '')) : undefined;

        // Extract Retailer
        const retailerMatch = block.match(/data-ga-store="([^"]+)"/);
        const retailer = retailerMatch ? retailerMatch[1] : 'Unknown';

        // Extract URL
        const urlMatch = block.match(/href="([^"]+)"/);
        const url = urlMatch ? urlMatch[1].replace(/&amp;/g, '&') : ''; // Decode entities

        // Extract Stock
        const stockMatch = block.match(/class="stock-label[^"]*">([^<]+)/);
        const inStock = stockMatch ? stockMatch[1].toLowerCase().includes('available') || stockMatch[1].toLowerCase().includes('in stock') : false;

        if (price > 0 && url) {
            offers.push({ price, cpr, retailer, url, inStock });
        }
    }

    return offers;
}
