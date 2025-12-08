import Link from "next/link";

const categories = [
    {
        id: 1,
        name: 'Women\'s Fashion',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        href: '/shop?category=women',
        count: '120+ Items'
    },
    {
        id: 2,
        name: 'Men\'s Collection',
        image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        href: '/shop?category=men',
        count: '85+ Items'
    },
    {
        id: 3,
        name: 'Electronics',
        image: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        href: '/shop?category=electronics',
        count: '45+ Items'
    },
    {
        id: 4,
        name: 'Jewelry',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        href: '/shop?category=jewelery',
        count: '60+ Items'
    },
    {
        id: 5,
        name: 'Accessories',
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        href: '/shop',
        count: '30+ Items'
    },
    {
        id: 6,
        name: 'Footwear',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        href: '/shop',
        count: '50+ Items'
    }
];

export default function CategoriesPage() {
    return (
        <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Categories</h1>
                    <p className="text-lg text-gray-500">Explore our wide range of premium collections.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={category.href}
                            className="group relative h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300 text-sm">{category.count}</span>
                                    <span className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
