import api from "@/lib/api";
import DetailsPage from "../../productsSection/DetailsPage";
import { COMPANY_NAME } from "../../constants/names";

export async function generateMetadata({ params }) {
    const { id } = await params;
    try {
        const res = await api.get(`/products/${id}`);
        const product = res.data;

        return {
            title: product.title,
            description: product.description.substring(0, 160),
            openGraph: {
                title: `${product.title} | ${COMPANY_NAME}`,
                description: product.description.substring(0, 160),
                type: "article",
                url: `/product/${id}`,
                images: [
                    {
                        url: product.image,
                        width: 800,
                        height: 600,
                        alt: product.title,
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: product.title,
                description: product.description.substring(0, 160),
                images: [product.image],
            },
        };
    } catch (error) {
        return {
            title: "Product Not Found",
            description: "The requested product could not be found.",
        };
    }
}

export default async function Page({ params }) {
    const { id } = await params;

    // Fetch product for JSON-LD (redundant but necessary for server component scripts)
    let product = null;
    try {
        const res = await api.get(`/products/${id}`);
        product = res.data;
    } catch (e) { }

    const jsonLd = product ? {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.title,
        "image": product.image,
        "description": product.description,
        "sku": product._id,
        "offers": {
            "@type": "Offer",
            "url": `https://luxestore-ecommerce.vercel.app/product/${id}`,
            "priceCurrency": "PKR",
            "price": product.newPrice || product.price,
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        }
    } : null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <DetailsPage id={id} />
        </>
    );
}
