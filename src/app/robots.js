export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin", "/api", "/login", "/signup"],
            },
        ],
        sitemap: "https://luxestore-ecommerce.vercel.app/sitemap.xml",
    };
}
