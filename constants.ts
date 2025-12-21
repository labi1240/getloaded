import { Product } from './types';

const RAW_AMMO_DATA = [
  {
    "id": "c8362c51-3189-5b7d-8440-72ecddae0809",
    "kind": "AMMO",
    "title": "Fetter 12 Gauge Ammunition 2.75\" Shotshells 1 Oz #5 Shot 25 Rounds",
    "image": "https://res.cloudinary.com/dhmfazp5l/image/upload/v1765561153/Fetter_12_Gauge_Ammunition_2_75_Shotshells_1_Oz_5_Shot_25_Rounds_4603806726042.jpg",
    "brand": {
      "id": 190,
      "name": "Fetter",
      "slug": "fetter",
      "logo": "https://res.cloudinary.com/dhmfazp5l/image/upload/v1765613749/logo_Fetter.png"
    },
    "offers": [
      {
        "id": 59663,
        "itemId": "c8362c51-3189-5b7d-8440-72ecddae0809",
        "retailerId": 39,
        "url": "#",
        "inStock": true,
        "price": 16.99,
        "shippingCost": 0.0,
        "total": 16.99,
        "freeShipping": false,
        "unitsCount": 25,
        "unitPrice": 0.55,
        "retailer": {
          "id": 39,
          "name": "Optics Planet",
          "domain": "opticsplanet.com",
          "logo": "https://res.cloudinary.com/dhmfazp5l/image/upload/v1765613773/logo_Optics_Planet.webp"
        }
      }
    ],
    "ammoSpecs": {
      "velocity": 1200,
      "casing": "Plastic",
      "grain": 437.5,
      "caliber": { "name": "12 Gauge" }
    },
    "priceHistory": [0.65, 0.62, 0.60, 0.58, 0.55]
  },
  {
    "id": "ammo-556-win",
    "kind": "AMMO",
    "title": "Winchester White Box 5.56mm NATO 55gr FMJ",
    "image": "https://res.cloudinary.com/dhmfazp5l/image/upload/v1765561187/Federal_PTSSX193F_9_12_Gauge_604544637991.jpg",
    "brand": {
      "id": 40,
      "name": "Winchester",
      "slug": "winchester",
      "logo": null
    },
    "offers": [
      {
        "id": 9991,
        "itemId": "ammo-556-win",
        "retailerId": 2,
        "url": "#",
        "inStock": true,
        "price": 12.99,
        "shippingCost": 0.0,
        "total": 12.99,
        "freeShipping": false,
        "unitsCount": 20,
        "unitPrice": 0.65,
        "retailer": { "id": 2, "name": "Locked Loaded", "domain": "lockedloaded.com", "logo": null }
      }
    ],
    "ammoSpecs": {
      "velocity": 3240,
      "casing": "Brass",
      "grain": 55,
      "caliber": { "name": "5.56 NATO" }
    },
    "priceHistory": [0.70, 0.68, 0.65]
  },
  {
    "id": "c0cd42ba-8f1f-5ae4-99be-daa2c4ee916c",
    "kind": "AMMO",
    "title": "Remington T9MM3B 9mm Luger",
    "image": "https://res.cloudinary.com/dhmfazp5l/image/upload/v1765560994/Remington_T9MM3B_9mm_047700490601.jpg",
    "brand": {
      "id": 19,
      "name": "Remington",
      "slug": "remington",
      "logo": "https://res.cloudinary.com/dhmfazp5l/image/upload/v1765613753/logo_Remington.ico"
    },
    "offers": [
      {
        "id": 37769,
        "itemId": "c0cd42ba-8f1f-5ae4-99be-daa2c4ee916c",
        "retailerId": 42,
        "url": "#",
        "inStock": true,
        "price": 34.0,
        "shippingCost": 0.0,
        "total": 34.0,
        "freeShipping": false,
        "unitsCount": 50,
        "unitPrice": 0.68,
        "retailer": {
          "id": 42,
          "name": "Sentry Ammo",
          "domain": "sentryammo.com",
          "logo": "https://res.cloudinary.com/dhmfazp5l/image/upload/v1765613773/logo_Sentry_Ammo.jpg"
        }
      }
    ],
    "ammoSpecs": {
      "velocity": 1145,
      "casing": "Brass",
      "grain": 115,
      "caliber": { "name": "9mm" }
    },
    "priceHistory": [0.35, 0.34, 0.32]
  }
];

const TRANSFORMED_AMMO: Product[] = RAW_AMMO_DATA.map((item: any) => ({
  id: item.id,
  slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), // Generate slug
  kind: 'AMMO',
  title: item.title,
  image: item.image,
  brand: item.brand,
  caliber: item.ammoSpecs.caliber.name,
  grain: item.ammoSpecs.grain || 0,
  velocity: item.ammoSpecs.velocity || 0,
  casing: item.ammoSpecs.casing,
  priceHistory: item.priceHistory,
  offers: item.offers.map((offer: any) => ({
    ...offer,
    cpr: offer.unitPrice,
    roundCount: offer.unitsCount
  }))
}));

const FIREARMS: Product[] = [
  {
    id: "firearm-9mm-sw",
    slug: "smith-wesson-mp9-m20",
    kind: "FIREARM",
    title: "Smith & Wesson M&P9 M2.0",
    image: "https://res.cloudinary.com/dhmfazp5l/image/upload/v1765690562/Smith_Wesson_M_P9_M2_0_OR_LE_USED_12662U_9mm_15_4_022188892192.jpg",
    brand: { id: 78, name: "Smith & Wesson", slug: "smith-wesson", logo: null },
    caliber: "9mm",
    capacity: "15+1",
    barrelLength: "4\"",
    offers: [{ id: 101, itemId: "firearm-9mm-sw", retailerId: 2, url: "#", inStock: true, price: 481.74, shippingCost: 0, total: 481.74, freeShipping: true, retailer: { id: 2, name: "Locked Loaded", domain: null, logo: null } }]
  },
  {
    id: "firearm-12ga-rem",
    slug: "remington-870-fieldmaster-12-gauge",
    kind: "FIREARM",
    title: "Remington 870 Fieldmaster 12 Gauge",
    image: "https://res.cloudinary.com/dhmfazp5l/image/upload/v1765690563/Smith_Wesson_M_P_15_Sport_III_13807_223_5_56_30_1_rounds_16_022188894110.jpg",
    brand: { id: 19, name: "Remington", slug: "remington", logo: null },
    caliber: "12 Gauge",
    capacity: "4+1",
    barrelLength: "28\"",
    offers: [{ id: 102, itemId: "firearm-12ga-rem", retailerId: 2, url: "#", inStock: true, price: 549.99, shippingCost: 0, total: 549.99, freeShipping: true, retailer: { id: 2, name: "Locked Loaded", domain: null, logo: null } }]
  },
  {
    id: "firearm-556-sw",
    slug: "smith-wesson-mp-15-sport-iii",
    kind: "FIREARM",
    title: "Smith & Wesson M&P 15 Sport III",
    image: "https://res.cloudinary.com/dhmfazp5l/image/upload/v1765690563/Smith_Wesson_M_P_15_Sport_III_13807_223_5_56_30_1_rounds_16_022188894110.jpg",
    brand: { id: 78, name: "Smith & Wesson", slug: "smith-wesson", logo: null },
    caliber: "5.56 NATO",
    capacity: "30+1",
    barrelLength: "16\"",
    offers: [{ id: 103, itemId: "firearm-556-sw", retailerId: 4, url: "#", inStock: true, price: 637.99, shippingCost: 0, total: 637.99, freeShipping: true, retailer: { id: 4, name: "BH Armory", domain: null, logo: null } }]
  }
];

export const MOCK_PRODUCTS: Product[] = [...FIREARMS, ...TRANSFORMED_AMMO];