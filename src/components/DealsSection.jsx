import Link from "next/link";

export default function DealsSection() {
    return (
        <section className="py-16 bg-[#f5f5f5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl overflow-hidden bg-blue-600 shadow-2xl">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                            alt="Sale background"
                            className="w-full h-full object-cover opacity-20 mix-blend-multiply"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-600/80"></div>
                    </div>

                    <div className="relative py-16 px-6 sm:px-12 md:py-20 md:px-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
                                End of Season Sale
                            </h2>
                            <p className="text-blue-100 text-lg mb-8">
                                Get up to <span className="font-bold text-white text-2xl">50% OFF</span> on selected premium items.
                                Limited time offer. Don't miss out on the best deals of the year.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Link
                                    href="/sale"
                                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-full text-blue-700 bg-white hover:bg-gray-50 transition-all hover:shadow-lg transform hover:-translate-y-1"
                                >
                                    Shop the Sale
                                </Link>
                            </div>
                        </div>

                        <div className="hidden md:block">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="text-center text-white">
                                    <p className="text-sm uppercase tracking-widest mb-2">Offer Ends In</p>
                                    <div className="flex gap-4 font-mono text-3xl font-bold">
                                        <div>02<span className="text-xs block font-sans font-normal opacity-70">Days</span></div>
                                        <div>:</div>
                                        <div>14<span className="text-xs block font-sans font-normal opacity-70">Hours</span></div>
                                        <div>:</div>
                                        <div>45<span className="text-xs block font-sans font-normal opacity-70">Mins</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
