Dynamic Category Routes Walkthrough
This document outlines the implementation of "Smart Routing" for deep SEO-friendly category paths.

Overview
The application now supports dynamic segment routing under the /ammo/* path. It automatically distinguishes between Product Pages and Category Filter Pages.

URL Patterns
URL Pattern Type Example Behavior
/ammo/[single-slug] Product /ammo/federal-9mm-fmj-115gr Renders Product Detail Page (Highest Priority)
/ammo/[caliber] Category /ammo/9mm-luger Renders Category Page filtered to 9mm
/ammo/[brand] Category /ammo/federal Renders Category Page filtered to Federal
/ammo/[segment1]/[segment2] Deep Category /ammo/9mm-luger/brass Renders Category Page filtered to 9mm AND Brass
How It Works
Smart Router (
app/ammo/[...slug]/page.tsx
)
Product Check: First attempts to match the first segment against known Product slugs.
Filter Parsing: If no product match, it iterates through all segments and checks them against:
Valid Caliber Slugs (Database check)
Valid Brand Slugs (Database check)
Common Casings (Static whitelist)
Hydration: If valid filters are found, it fetches relevant products server-side and hydrates the
CategoryPage
 client state.
Data Layer
Updated
getProducts
 to accept server-side filters to ensure SEO pages contain relevant content from the first render.
Added
isValidCaliberSlug
 and
isValidBrandSlug
 helpers.
Validation
Build Status: Passed get_errors check.
