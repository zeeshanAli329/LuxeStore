import Link from "next/link";

export default function Hero() {
    return (
        <div className="relative bg-gray-900 overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                    alt="Lifestyle background"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent"></div>
            </div>

            <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
                    Elevate Your Style <br className="hidden sm:block" />
                    <span className="text-blue-400">With Premium Essentials</span>
                </h1>
                <p className="mt-6 text-xl text-gray-300 max-w-3xl mb-10">
                    Discover our curated collection of high-quality fashion, electronics, and accessories.
                    Designed for the modern lifestyle.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-all hover:shadow-lg hover:scale-105"
                    >
                        Shop Now
                    </Link>
                    <Link
                        href="/deals"
                        className="inline-flex items-center justify-center px-8 py-4 border border-white text-base font-medium rounded-full text-white hover:bg-white hover:text-gray-900 md:text-lg transition-all"
                    >
                        View Deals
                    </Link>
                </div>
            </div>
        </div>
    );
}
