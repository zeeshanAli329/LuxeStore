"use client";
import React from 'react';
import Image from 'next/image';

export default function MaintenancePage() {
    const phoneNumber = "923279430520"; // From WhatsAppButton.jsx
    const message = "Hi, I'm interested in knowing more about your upcoming products!";

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-100 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-[20%] right-[-5%] w-[20%] h-[20%] bg-emerald-100 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <main className="z-10 flex flex-col items-center text-center max-w-2xl w-full gap-8">
                {/* Floating Illustration Container */}
                <div className="relative w-full aspect-square max-w-[400px] animate-float drop-shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-white/10 rounded-3xl backdrop-blur-[2px] border border-white/20 -z-10 scale-105 rotate-3"></div>
                    <Image
                        src="/ecommerce_maintenance_illustration.png"
                        alt="Ecommerce Maintenance"
                        width={500}
                        height={500}
                        className="w-full h-full object-contain mix-blend-multiply"
                        priority
                    />
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
                        We’ll Be <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500">Back Soon!</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-md mx-auto leading-relaxed">
                        We're currently updating our store to bring you the best shopping experience. Stay updated for new products and offers.
                    </p>
                </div>

                {/* Call to Action */}
                <div className="flex flex-col items-center gap-4 w-full">
                    <a
                        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-200 hover:shadow-green-300 hover:scale-[1.02] transition-all active:scale-95 overflow-hidden"
                    >
                        {/* Gloss Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine"></div>

                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-8.68-2.03-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.297.298-.495.099-.198.05-.372-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                        Contact us on WhatsApp for updates
                    </a>
                    <p className="text-sm font-medium text-slate-400">Response time: Usually within minutes</p>
                </div>
            </main>

            {/* Footer / Contact Details */}
            <footer className="mt-12 md:mt-24 z-10 text-slate-400 text-sm flex gap-6">
                <span className="hover:text-slate-600 cursor-pointer transition-colors">Instagram</span>
                <span className="hover:text-slate-600 cursor-pointer transition-colors">Facebook</span>
                <span className="hover:text-slate-600 cursor-pointer transition-colors">Privacy Policy</span>
            </footer>

            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-shine {
          animation: shine 0.8s ease-in-out forwards;
        }
      `}</style>
        </div>
    );
}
