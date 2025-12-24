"use client";

import { useState } from "react";

export default function ProductGallery({ mainImage, additionalImages = [], title = "Product" }) {
    // Mandatory images logic
    let galleryImages = [];
    if (Array.isArray(additionalImages) && additionalImages.length > 0) {
        galleryImages = additionalImages;
    } else {
        galleryImages = [mainImage];
    }

    const [selectedIndex, setSelectedIndex] = useState(0);
    const selectedImage = galleryImages[selectedIndex] || galleryImages[0];

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image Area */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center group shadow-sm">
                <img
                    src={selectedImage || "/placeholder.png"}
                    alt={`${title} - view ${selectedIndex + 1}`}
                    className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
                />
            </div>

            {/* Thumbnails Row */}
            {galleryImages.length > 1 && (
                <div className="flex gap-3 gallery-scroll pb-2 snap-x">
                    {galleryImages.map((imgUrl, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all p-1 snap-start cursor-pointer ${selectedIndex === index
                                ? "border-blue-600 ring-2 ring-blue-100"
                                : "border-gray-100 hover:border-gray-300"
                                }`}
                        >
                            <img
                                src={imgUrl}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover rounded-md"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
