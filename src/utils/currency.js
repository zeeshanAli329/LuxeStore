export const formatPKR = (amount) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    const number = Number(value);
    if (isNaN(number)) return "Rs 0";

    // Format with commas, no decimals for PKR usually (or 0 fraction digits)
    return "Rs " + number.toLocaleString("en-PK", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
};
