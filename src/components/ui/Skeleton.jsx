"use client";

import React from "react";

/**
 * A reusable Skeleton component that provides a shimmering loading state.
 * @param {string} className - Tailwind or custom CSS classes for sizing and shape.
 */
const Skeleton = ({ className = "" }) => {
    return (
        <div
            className={`shimmer rounded-md ${className}`}
            aria-hidden="true"
        />
    );
};

export default Skeleton;
