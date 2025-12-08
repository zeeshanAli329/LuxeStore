export default function Newsletter() {
    return (
        <section className="py-20 bg-[#fafafa]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Subscribe to our Newsletter</h2>
                    <p className="text-gray-500 mb-8 max-w-xl mx-auto">
                        Stay updated with our latest collections, exclusive deals, and fashion tips.
                        Join 50,000+ subscribers today.
                    </p>

                    <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900"
                            required
                        />
                        <button
                            type="submit"
                            className="px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
                        >
                            Subscribe
                        </button>
                    </form>
                    <p className="text-xs text-gray-400 mt-4">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </section>
    );
}
