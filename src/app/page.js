import HomeClient from "./HomeClient";
import { COMPANY_NAME } from "./constants/names";

export const metadata = {
  title: `${COMPANY_NAME} Premium Luxury Fashion & Lifestyle`,
  description: `Explore the latest trends in premium fashion and lifestyle products at ${COMPANY_NAME}. Discover our curated collections and experience ultimate quality.`,
}

export default function Page() {
  return <HomeClient />;
  // return <ComingSoonPage />;
}