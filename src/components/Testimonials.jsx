export default function Testimonials() {
    const reviews = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Fashion Blogger",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            content: "The quality of the products is absolutely outstanding. I've never been more impressed with an online shopping experience. Highly recommended!",
            rating: 5
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Tech Enthusiast",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            content: "Fast shipping, great customer service, and the electronics selection is top-notch. Will definitely be buying from here again.",
            rating: 5
        },
        {
            id: 3,
            name: "Emily Davis",
            role: "Verified Buyer",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            content: "I love the clean design of the website and how easy it is to find what I'm looking for. The wishlist feature is a lifesaver!",
            rating: 4
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Don't just take our word for it. Here's what our community has to say about their experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-6">
                                <img
                                    src={review.image}
                                    alt={review.name}
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                                    <p className="text-sm text-gray-500">{review.role}</p>
                                </div>
                            </div>
                            <div className="flex text-yellow-400 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600 italic leading-relaxed">"{review.content}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
