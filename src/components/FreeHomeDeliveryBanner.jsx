export default function FreeHomeDeliveryBanner() {
    return (
        <div className="w-full bg-blue-600 text-white py-2 px-4 text-center font-medium text-sm md:text-base shadow-sm">
            <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Free Home Delivery on all orders
            </span>
        </div>
    );
}
