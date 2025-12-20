"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { COMPANY_NAME, ALT, LOGO } from "@/app/constants/names";
import { useStore } from "@/store";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { cart, user, logout } = useStore();

    const cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);
    const router = useRouter();

    // Body Scroll Lock
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setIsSearchOpen(e.target.value.length > 0);
    };

    const handleMenuClose = () => setIsMenuOpen(false);

    return (
        <nav className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="transition-opacity">
                            <img
                                className="h-8 md:h-14 w-auto bg-transparent object-contain"
                                src={LOGO}
                                alt={ALT}
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {["Home", "Shop", "Categories", "About", "Contact"].map((item) => (
                            <Link
                                key={item}
                                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                                className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 text-sm uppercase tracking-wide relative group py-2"
                            >
                                {item}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Right Icons & Search (Desktop) */}
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="relative group">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-48 lg:w-64 pl-10 pr-4 py-2 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm text-gray-900 placeholder-gray-500"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => searchQuery.length > 0 && setIsSearchOpen(true)}
                                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                                />
                                <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            {isSearchOpen && (
                                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                    <div className="p-3">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Suggestions</p>
                                        <ul>
                                            {["Men's Jacket", "Leather Bag", "Smart Watch"].map((item, idx) => (
                                                <li key={idx}>
                                                    <Link href="/shop" className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                                        {item}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => user ? router.push("/favorite-items") : router.push("/login?next=/favorite-items")}
                            className="text-gray-500 hover:text-blue-600 transition-colors transform hover:scale-110"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>

                        <button
                            onClick={() => user ? router.push("/cart") : router.push("/login?next=/cart")}
                            className="text-gray-500 hover:text-blue-600 transition-colors relative transform hover:scale-110"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {!user ? (
                            <button onClick={() => router.push("/login")} className="text-gray-500 hover:text-blue-600 transition-colors transform hover:scale-110">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 hidden lg:block">Hi, {user.name}</span>
                                <button onClick={logout} className="text-red-500 hover:text-red-600 font-medium text-sm">Logout</button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button & Icons */}
                    <div className="md:hidden flex items-center gap-3">
                        {/* Cart Icon */}
                        <button
                            onClick={() => user ? router.push("/cart") : router.push("/login?next=/cart")}
                            className="text-gray-500 hover:text-blue-600 transition-colors relative"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Profile Icon */}
                        <Link href={user ? "/profile" : "/login?next=/profile"} className="text-gray-500 hover:text-blue-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </Link>

                        {/* Hamburger Button */}
                        <button onClick={() => setIsMenuOpen(true)} className="text-gray-500 hover:text-gray-900 focus:outline-none p-2 z-50">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Slide-in Drawer */}
            <div className={`md:hidden fixed inset-0 z-40 ${isMenuOpen ? "" : "pointer-events-none"}`}>
                {/* Overlay */}
                <div
                    className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={handleMenuClose}
                />

                {/* Drawer */}
                <div className={`fixed inset-y-0 right-0 w-[80%] max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full bg-white">
                        {/* Drawer Header */}
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <span className="text-lg font-bold text-gray-900">Menu</span>
                            <button onClick={handleMenuClose} className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-200 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4">
                            {/* Search */}
                            <div className="relative mb-6">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            {/* Nav Links */}
                            <div className="flex flex-col space-y-2">
                                {["Home", "Shop", "Categories", "About", "Contact"].map((item) => (
                                    <Link
                                        key={item}
                                        href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                                        className="block px-4 py-3 rounded-lg text-lg font-medium text-gray-800 hover:text-blue-600 hover:bg-blue-50 transition-colors border-b border-gray-50"
                                        onClick={handleMenuClose}
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </div>

                            {/* Additional Links in Drawer */}
                            <div className="pt-4 mt-4 border-t border-gray-100">
                                {!user ? (
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium text-gray-800 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                        onClick={handleMenuClose}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        Login / Register
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium text-gray-800 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                            onClick={handleMenuClose}
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            My Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                handleMenuClose();
                                            }}
                                            className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
