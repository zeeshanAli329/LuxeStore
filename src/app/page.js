"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { formatPKR } from "@/utils/currency"; // Use PKR
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import DealsSection from "@/components/DealsSection";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // 1. Featured (Max 8)
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);

  // 2. Categories Logic: Pick 4 distinct categories
  const allCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
  // Priority order or just take first 4
  const displayCategories = allCategories.slice(0, 4);

  // Helper to get image for category
  const getCategoryImage = (cat) => {
    const prod = products.find(p => p.category === cat);
    return prod ? prod.image : "https://placehold.co/400";
  };

  return (
    <div className="bg-white">
      <Hero />

      {/* 4 Category Tiles in One Row */}
      {displayCategories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {displayCategories.map(cat => (
              <Link key={cat} href={`/shop?category=${encodeURIComponent(cat)}`} className="group block relative rounded-lg overflow-hidden h-40 sm:h-56 cursor-pointer">
                <div className="absolute inset-0 bg-gray-900 opacity-20 group-hover:opacity-10 transition-opacity z-10"></div>
                <img
                  src={getCategoryImage(cat)}
                  alt={cat}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <h3 className="text-white text-xl sm:text-2xl font-bold uppercase tracking-wider shadow-sm text-shadow-md">{cat}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Section */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center uppercase tracking-wide">Featured Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} showCategory={false} />
            ))}
          </div>
        </section>
      )}

      {/* Deals Section */}
      <DealsSection />

      {/* ALL PRODUCTS GRID (Without Category Sections) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-900">All Products</h2>
          <Link href="/shop" className="text-indigo-600 font-semibold hover:text-indigo-800">
            View Shop &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {products.slice(0, 20).map((product) => ( // Show first 20 or so, then link to shop
            <ProductCard key={product._id} product={product} showCategory={false} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/shop" className="inline-block bg-gray-900 text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-lg cursor-pointer">
            Load More Products
          </Link>
        </div>
      </section>

      <Testimonials />
      <Newsletter />
    </div>
  );
}

// Inline Product Card to control Category Visibility
function ProductCard({ product, showCategory = false }) {
  if (!product) return null;

  return (
    <Link href={`/product/${product._id}`} className="group block w-full h-full cursor-pointer bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
      <div className="w-full h-40 sm:h-auto sm:aspect-w-1 sm:aspect-h-1 bg-gray-200 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm text-gray-700 font-medium line-clamp-1">{product.title}</h3>
          {showCategory && <p className="mt-1 text-xs text-gray-500 capitalize">{product.category}</p>}
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            <p className="text-lg font-bold text-gray-900">{formatPKR(product.newPrice || product.price)}</p>
            {product.oldPrice && (
              <p className="text-xs line-through text-gray-400">{formatPKR(product.oldPrice)}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}