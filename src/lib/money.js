/**
 * Safely converts a value to a number.
 * Handles strings with currency symbols and commas.
 */
export const toNumber = (value) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return isNaN(value) ? 0 : value;

    if (typeof value === "string") {
        // Remove commas, currency symbols ($, Rs, ₨), and spaces
        const cleaned = value.replace(/[$,₨Rs\s,]/g, "");
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
    }

    return 0;
};

/**
 * Formats a number as Pakistani Rupees (PKR).
 * Ensures it never returns NaN.
 */
export const formatPKR = (amount) => {
    const num = toNumber(amount);

    try {
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num).replace("PKR", "Rs").trim();
    } catch (e) {
        // Fallback if Intl fails
        return `Rs ${num.toLocaleString()}`;
    }
};
