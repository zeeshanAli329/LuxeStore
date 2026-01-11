"use client";
import Link from "next/link";
import CountdownTimer from "./CountdownTimer";

export default function SaleBanner({
    title = "End of Season Sale",
    description = "Exclusive deals on our premium collection. Limited time offers.",
    ctaText = "Shop the Sale",
    ctaHref = "/deals",
    deals = []
}) {
    return (
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-8 overflow-hidden shadow-2xl relative">
            {/* Background Pattern/Overlay */}
            <div className="absolute inset-0 opacity-10">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 sm:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12">

                {/* Left Side: Text Content */}
                <div className="text-center md:text-left flex-1 space-y-6">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        {title}
                    </h2>
                    <p className="text-blue-100 text-lg sm:text-xl max-w-xl mx-auto md:mx-0 font-medium">
                        {description}
                    </p>
                    <div className="pt-2">
                        <Link
                            href={ctaHref}
                            className="inline-block bg-white text-blue-700 font-bold text-base sm:text-lg px-8 py-3 rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            {ctaText}
                        </Link>
                    </div>
                </div>

                {/* Right Side: Timer Card */}
                {deals && deals.length > 0 && (
                    <div className="flex-shrink-0">
                        <CountdownTimer deals={deals} />
                    </div>
                )}
            </div>
        </section>
    );
}
