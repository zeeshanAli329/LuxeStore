import CheckoutClient from "./CheckoutClient";

export const metadata = {
    title: "Secure Checkout",
    description: "Complete your order by providing shipping and payment details. Your data is handled with maximum security.",
};

export default function Page() {
    return <CheckoutClient />;
}
