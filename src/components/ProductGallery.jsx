"use client";

import { useState, useEffect } from "react";

export default function ProductGallery({ mainImage, additionalImages = [], title = "Product" }) {
    // Mandatory images logic
    let galleryImages = [];
    if (Array.isArray(additionalImages) && additionalImages.length > 0) {
        galleryImages = additionalImages;
    } else {
        galleryImages = [mainImage];
    }

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
    const selectedImage = galleryImages[selectedIndex] || galleryImages[0];

    // Handle ESC key and Body Scroll
    useEffect(() => {
        if (isFullscreenOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsFullscreenOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "auto";
        };
    }, [isFullscreenOpen]);

    return (
        <div className="flex flex-col gap-3">
            {/* Main Image Area */}
            <div
                className="relative h-[45vh] lg:h-[60vh] bg-white rounded-[20px] overflow-hidden border border-gray-100 flex items-center justify-center group shadow-sm cursor-pointer w-full"
                onClick={() => setIsFullscreenOpen(true)}
            >
                <img
                    src={selectedImage || "/placeholder.png"}
                    alt={`${title} - view ${selectedIndex + 1}`}
                    className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
                />
            </div>

            {/* Thumbnails Row */}
            {galleryImages.length > 1 && (
                <div className="flex gap-2 gallery-scroll pb-1 snap-x">
                    {galleryImages.map((imgUrl, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border transition-all p-1 snap-start cursor-pointer ${selectedIndex === index
                                ? "border-blue-600 ring-1 ring-blue-100"
                                : "border-gray-100 hover:border-gray-300"
                                }`}
                        >
                            <img
                                src={imgUrl}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover rounded-sm"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Full Screen Overlay */}
            {isFullscreenOpen && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setIsFullscreenOpen(false)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsFullscreenOpen(false);
                        }}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <img
                        src={selectedImage}
                        alt="Full Screen View"
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()} // Prevent close on image click
                    />
                </div>
            )}
        </div>
    );
}
