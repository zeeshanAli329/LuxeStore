"use client";

export default function AboutClient() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative h-[400px] bg-gray-900 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="Team working"
                        className="w-full h-full object-cover opacity-40"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Story</h1>
                    <p className="text-xl text-gray-200 max-w-2xl">
                        Redefining premium eCommerce with quality, sustainability, and exceptional service.
                    </p>
                </div>
            </div>

            {/* Mission & Vision */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            At LuxeStore, we believe that luxury shouldn't be elusive. Our mission is to curate the finest products from around the globe and bring them to your doorstep with unmatched convenience. We are committed to quality, sustainability, and customer satisfaction above all else.
                        </p>
                        <div className="flex gap-4">
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <h3 className="font-bold text-blue-900 mb-2">Quality First</h3>
                                <p className="text-sm text-blue-700">We never compromise on the quality of our products.</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-xl">
                                <h3 className="font-bold text-green-900 mb-2">Sustainable</h3>
                                <p className="text-sm text-green-700">Eco-friendly packaging and ethical sourcing.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                            alt="Office meeting"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h3>
                            <p className="text-gray-500">Free express shipping on all orders over $100. We ensure your package arrives safely and on time.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
                            <p className="text-gray-500">Every item is hand-picked and quality checked. We guarantee authenticity and durability.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
                            <p className="text-gray-500">Our dedicated support team is always here to help you with any questions or concerns.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
