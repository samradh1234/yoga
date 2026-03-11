import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NoticePopup() {
    const [notices, setNotices] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/notices');
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        setNotices(data);
                        if (!sessionStorage.getItem('noticeDismissed')) {
                            setIsVisible(true);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch notices for popup:", err);
            }
        };
        fetchNotices();
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem('noticeDismissed', 'true');
    };

    if (!isVisible || notices.length === 0) return null;

    const currentNotice = notices[currentIndex];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 50, y: 50 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-[#241a0f] border-2 border-[#b8860b] rounded-2xl shadow-2xl overflow-hidden font-sans"
                >
                    <div className="bg-[#b8860b] text-white px-4 py-3 flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2">
                            <i className="fas fa-bell text-yellow-300 animate-pulse"></i>
                            Notice Board
                        </h3>
                        <button onClick={handleDismiss} className="text-white hover:text-gray-200 transition">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="p-5">
                        <Link to="/notices" onClick={() => { setIsVisible(false); sessionStorage.setItem('noticeDismissed', 'true'); }} className="block group">
                            <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-[#b8860b] transition">{currentNotice.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">
                                {currentNotice.content}
                            </p>
                        </Link>
                    </div>

                    <div className="bg-gray-50 dark:bg-black/20 px-4 py-3 flex justify-between items-center text-xs border-t border-gray-100 dark:border-white/5">
                        <Link to="/notices" onClick={() => { setIsVisible(false); sessionStorage.setItem('noticeDismissed', 'true'); }} className="font-bold text-[#b8860b] hover:text-[#9a7009] flex items-center gap-1 transition">
                            View All <i className="fas fa-arrow-right text-[10px]"></i>
                        </Link>
                    </div>

                    {notices.length > 1 && (
                        <div className="bg-gray-50 dark:bg-black/20 px-4 py-2 flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-medium">
                                {currentIndex + 1} of {notices.length}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentIndex((prev) => (prev - 1 + notices.length) % notices.length)}
                                    className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-[#b8860b] hover:text-white transition"
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <button
                                    onClick={() => setCurrentIndex((prev) => (prev + 1) % notices.length)}
                                    className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-[#b8860b] hover:text-white transition"
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
