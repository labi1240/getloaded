/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    cacheComponents: true,

    images: {
        domains: [],
    },
    experimental: {
        serverComponentsHmrCache: true, // defaults to true
    },
};

export default nextConfig;
