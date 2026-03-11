import React from 'react';
import { useTheme } from './ThemeContext';
import { Link, Outlet, useLocation } from 'react-router-dom';
import logo from './assets/polytechnic.png';

export default function AdminDashboard() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const location = useLocation();

    return (
        <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDark ? 'bg-[#1a1209] text-gray-100' : 'bg-[#fff9f2] text-[#3e2f1c]'}`}>
            {/* Sidebar */}
            <aside className={`w-64 shadow-sm flex flex-col justify-between py-8 border-r flex-shrink-0 z-10 transition-all duration-300 ${isDark ? 'bg-[#241a0f] border-orange-900/30' : 'bg-white border-orange-100'}`}>
                <div>
                    <div className="flex flex-col items-center mb-10">
                        {/* Custom Logo Image */}
                        <div className="mb-3">
                            <img
                                src={logo}
                                alt="Admin Logo"
                                className="w-16 h-16 rounded-full object-cover border-2 border-[#b8860b] shadow-md"
                            />
                        </div>
                        <h1 className={`text-xl font-bold tracking-wider ${isDark ? 'text-white' : 'text-[#3e2f1c]'}`}>KPT YOGA</h1>
                    </div>

                    <nav className="flex flex-col gap-2 px-8">
                        <Link to="/admin" className={`flex items-center gap-5 px-4 py-3 rounded-2xl text-base font-semibold transition-colors ${location.pathname === '/admin' ? (isDark ? 'bg-[#b8860b]/20 text-[#b8860b]' : 'bg-[#fff9f2] text-[#b8860b]') : (isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-[#617688] hover:text-[#3e2f1c] hover:bg-orange-50')}`}>
                            <i className="fas fa-columns w-5 text-center text-lg"></i>
                            Dashboard
                        </Link>
                        <Link to="/admin/members" className={`flex items-center gap-5 px-4 py-3 rounded-2xl text-base font-semibold transition-colors ${location.pathname === '/admin/members' ? (isDark ? 'bg-[#b8860b]/20 text-[#b8860b]' : 'bg-[#fff9f2] text-[#b8860b]') : (isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-[#617688] hover:text-[#3e2f1c] hover:bg-orange-50')}`}>
                            <i className="fas fa-image w-5 text-center text-lg"></i>
                            Upload Images
                        </Link>
                        <Link to="/admin/notices" className={`flex items-center gap-5 px-4 py-3 rounded-2xl text-base font-semibold transition-colors ${location.pathname === '/admin/notices' ? (isDark ? 'bg-[#b8860b]/20 text-[#b8860b]' : 'bg-[#fff9f2] text-[#b8860b]') : (isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-[#617688] hover:text-[#3e2f1c] hover:bg-orange-50')}`}>
                            <i className="fas fa-bullhorn w-5 text-center text-lg"></i>
                            Notices
                        </Link>
                        <Link to="/admin/branches" className={`flex items-center gap-5 px-4 py-3 rounded-2xl text-base font-semibold transition-colors ${location.pathname === '/admin/branches' ? (isDark ? 'bg-[#b8860b]/20 text-[#b8860b]' : 'bg-[#fff9f2] text-[#b8860b]') : (isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-[#617688] hover:text-[#3e2f1c] hover:bg-orange-50')}`}>
                            <i className="fas fa-code-branch w-5 text-center text-lg"></i>
                            Branches
                        </Link>
                        <div className={`my-4 border-t mx-4 ${isDark ? 'border-orange-900/30' : 'border-orange-100'}`}></div>
                        <Link to="/" className={`flex items-center gap-5 px-4 py-3 rounded-2xl text-base font-semibold transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-[#617688] hover:text-[#3e2f1c] hover:bg-orange-50'}`}>
                            <i className="fas fa-arrow-left w-5 text-center text-lg"></i>
                            Back to Website
                        </Link>
                    </nav>
                </div>

                <div className="px-8">
                    <div className="mt-8 px-6 flex items-center gap-2">
                        <i className="far fa-sun text-gray-400"></i>
                        <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer" onClick={toggleTheme}>
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow transition-all ${isDark ? 'left-6 bg-gray-600' : 'left-1'}`}></div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area (Nested Routes injected here) */}
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Header (Moved here so it reflects across all nested routes except Members page could override it, or we just pass theme/toggleTheme down via context if needed) */}
                <header className="flex justify-end items-center mb-6">
                    <div className="flex items-center gap-6">
                        <i className="fas fa-search text-gray-400 cursor-pointer hover:text-gray-600 transition"></i>
                        <button onClick={toggleTheme} className={`transition ${isDark ? 'text-orange-300 hover:text-white' : 'text-gray-400 hover:text-[#b8860b]'}`}>
                            {theme === 'light' ? <i className="fas fa-moon text-lg"></i> : <i className="fas fa-sun text-lg"></i>}
                        </button>
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-[#3e2f1c]'}`}>Admin</span>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white bg-[#b8860b] border-2 shadow-sm ${isDark ? 'border-orange-900/30' : 'border-white'}`}>
                                A
                            </div>
                        </div>
                    </div>
                </header>

                <Outlet />
            </main>
        </div>
    );
}
