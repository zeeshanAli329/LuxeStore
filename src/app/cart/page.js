import CartClient from "./CartClient";

export const metadata = {
    title: "Your Shopping Cart",
    description: "Review your selected premium items and proceed to secure checkout.",
};

export default function Page() {
    return <CartClient />;
}
