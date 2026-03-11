import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import logo from './assets/123.jpg';

export default function AuthLanding() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ${isDark ? 'bg-[#1a1209]' : 'bg-[#fff9f2]'}`}>
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-yellow-900' : 'bg-orange-200'}`}></div>
                <div className={`absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-yellow-900' : 'bg-orange-200'}`}></div>
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-6 text-center">
                {/* Logo Section */}
                <div className="mb-8 animate-fadeIn">
                    <img
                        src={logo}
                        alt="KPT Yoga Club"
                        className="w-32 h-32 rounded-full object-cover shadow-2xl border-4 border-[#b8860b] hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* Title Section */}
                <h1 className={`text-4xl md:text-5xl font-bold mb-4 tracking-tight ${isDark ? 'text-white' : 'text-[#3e2f1c]'}`}>
                    Welcome to KPT Yoga Website
                </h1>
                <p className={`text-lg mb-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Please login or register to access our yoga classes and community features.
                </p>

                {/* Action Buttons */}
                <div className="w-full space-y-4 animate-slideUp">
                    <Link
                        to="/login"
                        className="block w-full py-4 px-6 bg-[#b8860b] hover:bg-[#9a7009] text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] text-lg"
                    >
                        Login to Your Account
                    </Link>
                    <Link
                        to="/register"
                        className={`block w-full py-4 px-6 border-2 border-[#b8860b] font-bold rounded-2xl transition-all active:scale-[0.98] text-lg ${isDark ? 'text-white hover:bg-white/5' : 'text-[#b8860b] hover:bg-[#b8860b]/5'
                            }`}
                    >
                        Join Our Community
                    </Link>
                </div>

                <div className="mt-12 text-sm text-gray-500">
                    © 2026 KPT Yoga Club. All rights reserved.
                </div>
            </div>

            <style>{`
                .animate-fadeIn {
                    animation: fadeIn 1s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.8s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
