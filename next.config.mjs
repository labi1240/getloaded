/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    cacheComponents: true,

    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'logo.clearbit.com' },
            { protocol: 'https', hostname: 'placehold.co' },
            { protocol: 'https', hostname: 'd3hpw7f66a218f.cloudfront.net' }, // Common CDN seen in industry
            // Add other potential image sources if known
        ],
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    experimental: {
        serverComponentsHmrCache: true, // defaults to true
    },
};

export default nextConfig;
