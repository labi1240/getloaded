/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://getloaded.vercel.app',
    generateRobotsTxt: true,
    exclude: ['/server-sitemap.xml'], // Exclude dynamic sitemap route from static generation
    robotsTxtOptions: {
        additionalSitemaps: [
            'https://getloaded.vercel.app/server-sitemap.xml', // Include dynamic sitemap in robots.txt
        ],
    },
}
