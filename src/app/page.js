import Hero from "../components/Hero";
import FeaturedCategories from "../components/FeaturedCategories";
import ProductList from "./productsSection/ProductList";
import DealsSection from "../components/DealsSection";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <FeaturedCategories />
      <ProductList />
      <DealsSection />
      <Testimonials />
      <Newsletter />
    </div>
  );
}