import BoutiqueClient from "./BoutiqueClient";

export const metadata = {
    title: "Boutique Designs | Luxe Store",
    description: "Exclusive custom designs for our boutique clients. Book your custom design journey today.",
};

export default function BoutiquePage() {
    return (
        <main className="min-h-screen bg-[#fcfcfc]">
            <BoutiqueClient />
        </main>
    );
}
