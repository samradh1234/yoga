import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function PublicNotices() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/notices');
                if (response.ok) {
                    const data = await response.json();
                    setNotices(data);
                }
            } catch (err) {
                console.error("Failed to fetch notices:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    const formatDate = (dateString) => {
        // SQLite saves as 'YYYY-MM-DD HH:MM:SS' UTC. Standardize to ISO 8601 for reliable JS parsing.
        const isoString = dateString.includes('T') ? dateString : dateString.replace(' ', 'T') + 'Z';
        const d = new Date(isoString);
        return d.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`min-h-screen py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? 'bg-[#1a1209]' : 'bg-[#fff9f2]'}`}>
            <div className="max-w-5xl mx-auto mt-20">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#3e2f1c]'}`}>Notice Board</h1>
                        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Stay up to date with the latest announcements and schedules.</p>
                    </div>
                    <Link to="/" className={`px-6 py-3 rounded-xl font-bold transition shadow-sm ${isDark ? 'bg-[#241a0f] text-gray-300 hover:text-white border border-orange-900/30' : 'bg-white text-gray-600 hover:text-[#3e2f1c] border border-orange-100'}`}>
                        <i className="fas fa-arrow-left mr-2"></i> Back Home
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <i className="fas fa-circle-notch fa-spin text-4xl text-[#b8860b]"></i>
                    </div>
                ) : notices.length === 0 ? (
                    <div className={`p-16 text-center rounded-3xl border-2 border-dashed ${isDark ? 'border-orange-900/30 bg-[#241a0f]/50' : 'border-orange-200 bg-white/50'}`}>
                        <i className="far fa-clipboard text-6xl text-orange-200 dark:text-orange-900/40 mb-6"></i>
                        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>No Notices Right Now</h3>
                        <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Check back later for important updates!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {notices.map((notice, index) => (
                            <motion.div
                                key={notice.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-8 rounded-3xl shadow-sm border relative overflow-hidden group ${isDark ? 'bg-[#241a0f] border-orange-900/30' : 'bg-white border-orange-100'}`}
                            >
                                {/* Decorative accent line */}
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#b8860b]"></div>

                                <div className="flex justify-between items-start mb-4">
                                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#3e2f1c]'}`}>
                                        {notice.title}
                                    </h2>
                                    <span className="text-xs font-bold tracking-wider uppercase px-4 py-2 bg-[#b8860b]/10 text-[#b8860b] rounded-full whitespace-nowrap">
                                        {formatDate(notice.created_at)}
                                    </span>
                                </div>
                                <div className={`prose prose-lg max-w-none ${isDark ? 'prose-invert text-gray-300' : 'text-gray-600'}`}>
                                    {notice.content.split('\n').map((paragraph, i) => (
                                        <p key={i} className="mb-2 leading-relaxed">{paragraph}</p>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
