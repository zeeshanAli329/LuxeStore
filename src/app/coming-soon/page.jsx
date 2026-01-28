"use client";
import React from 'react';
import Image from 'next/image';

export default function ComingSoonPage() {
    const phoneNumber = "923279430520"; // From your WhatsAppButton component
    const message = "Hi! I'm interested in your upcoming products and would like to stay updated.";

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-violet-100 selection:text-violet-900">

            {/* Premium Gradient Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-radial-gradient from-violet-50 to-transparent rounded-full blur-[120px] opacity-60"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-radial-gradient from-pink-50 to-transparent rounded-full blur-[120px] opacity-60"></div>
            <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-radial-gradient from-emerald-50 to-transparent rounded-full blur-[100px] opacity-40"></div>

            <main className="z-10 flex flex-col items-center text-center max-w-3xl w-full">

                {/* Animated Illustration Container */}
                <div className="relative w-full max-w-[450px] mb-8 animate-float drop-shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                    {/* Subtle Background Glass card for depth */}
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-md rounded-[2.5rem] border border-white/50 -rotate-2 transform scale-105 -z-10 shadow-sm"></div>

                    {/* <div className="p-4 md:p-8">
                        <Image
                            src="/ecommerce_maintenance_illustration.png"
                            alt="LuxeStore Coming Soon"
                            width={600}
                            height={600}
                            className="w-full h-auto object-contain transition-transform duration-700 hover:scale-105"
                            priority
                        />
                    </div> */}
                </div>

                {/* Messaging Section */}
                <div className="space-y-6 mb-10">
                    <div className="inline-block px-4 py-1.5 bg-violet-50 text-violet-600 rounded-full text-sm font-semibold tracking-wide uppercase mb-2 animate-fade-in">
                        New Collection Launching
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        We’re <span className=" bg-clip-text text-blue-400">Launching Soon</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 max-w-xl mx-auto leading-relaxed font-light">
                        Elevating your shopping experience with curated styles. Stay updated for new products and exclusive offers.
                    </p>
                </div>

                {/* WhatsApp CTA */}
                <div className="flex flex-col items-center gap-6 w-full animate-slide-up">
                    <a
                        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center justify-center gap-4 bg-[#075E54] hover:bg-[#128C7E] text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-[0_20px_40px_-10px_rgba(18,140,126,0.3)] transition-all duration-300 hover:-translate-y-1 active:scale-95 overflow-hidden w-full max-w-sm"
                    >
                        {/* Glossy reflective effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine"></div>

                        <svg className="w-7 h-7 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-8.68-2.03-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.297.298-.495.099-.198.05-.372-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                        Contact us for updates
                    </a>
                    <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <p className="text-sm font-medium text-slate-400">Join our growing community</p>
                    </div>
                </div>
            </main>

            {/* Modern Minimal Footer */}
            {/* <footer className="mt-16 md:mt-24 z-10 border-t border-slate-100 pt-8 w-full max-w-4xl flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-sm">
                <p>© 2026 LuxeStore. All rights reserved.</p>
                <div className="flex gap-8">
                    <span className="hover:text-violet-600 cursor-pointer transition-colors font-medium">Instagram</span>
                    <span className="hover:text-violet-600 cursor-pointer transition-colors font-medium">Facebook</span>
                    <span className="hover:text-violet-600 cursor-pointer transition-colors font-medium">Store Location</span>
                </div>
            </footer> */}

            {/* Custom Styles for Animations */}
            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-shine {
          animation: shine 1s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 1s ease-out forwards;
          animation-delay: 0.2s;
        }
        .bg-radial-gradient {
          background: radial-gradient(circle, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 70%);
        }
      `}</style>
        </div>
    );
}
