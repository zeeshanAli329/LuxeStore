import api from "@/lib/api";

export default async function sitemap() {
    const baseUrl = "https://luxestore-ecommerce.vercel.app";

    // Build static routes
    const routes = ["", "/shop", "/about", "/contact", "/cart"].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
    }));

    try {
        // Fetch products for dynamic routes
        const res = await api.get("/products");
        const products = res.data;

        const productRoutes = products.map((product) => ({
            url: `${baseUrl}/product/${product._id}`,
            lastModified: new Date(),
        }));

        // Fetch categories (unique from products)
        const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
        const categoryRoutes = categories.map((cat) => ({
            url: `${baseUrl}/shop?category=${encodeURIComponent(cat)}`,
            lastModified: new Date(),
        }));

        return [...routes, ...productRoutes, ...categoryRoutes];
    } catch (error) {
        console.error("Sitemap generation failed:", error);
        return routes;
    }
}
