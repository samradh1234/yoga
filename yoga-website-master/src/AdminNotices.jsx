import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';

export default function AdminNotices() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [notices, setNotices] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchNotices = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/notices');
            if (response.ok) {
                const data = await response.json();
                setNotices(data);
            } else {
                setError('Failed to fetch notices.');
            }
        } catch (err) {
            console.error('Fetch notices error:', err);
            setError('Error loading notices from the server.');
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleCreateNotice = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/notices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, content })
            });

            if (response.ok) {
                setTitle('');
                setContent('');
                setSuccessMsg('Notice posted successfully!');
                fetchNotices();
                setTimeout(() => setSuccessMsg(''), 4000);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to post notice.');
            }
        } catch (err) {
            console.error('Post notice error:', err);
            setError('Network error. Failed to post.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this notice?")) return;
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/notices/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchNotices();
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to delete notice.');
            }
        } catch (err) {
            console.error('Delete notice error:', err);
            setError('Network error. Failed to delete.');
        }
    };

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
        <div className="flex-1 w-full h-full flex flex-col gap-6">
            <div className={`p-6 rounded-xl shadow-sm border ${isDark ? 'bg-[#241a0f] border-orange-900/30' : 'bg-white border-orange-100'}`}>
                <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#3e2f1c]'}`}>Manage Notices</h2>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Create global announcements that will pop up on the frontend for all users to see.</p>

                {error && <div className="p-4 mb-4 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}
                {successMsg && <div className="p-4 mb-4 bg-green-100/20 border border-green-500/30 text-green-500 rounded-lg text-sm"><i className="fas fa-check-circle mr-2"></i>{successMsg}</div>}

                <form onSubmit={handleCreateNotice} className="space-y-4 max-w-2xl">
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Schedule Change for Wednesday"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#b8860b]/50 transition ${isDark ? 'bg-[#1a1209] border-orange-900/30 text-white' : 'bg-[#fff9f2] border-orange-100 text-[#3e2f1c]'}`}
                        />
                    </div>
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Content</label>
                        <textarea
                            rows="4"
                            required
                            placeholder="Type out your announcement details here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#b8860b]/50 transition ${isDark ? 'bg-[#1a1209] border-orange-900/30 text-white' : 'bg-[#fff9f2] border-orange-100 text-[#3e2f1c]'}`}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-3 bg-[#b8860b] hover:bg-[#9a7009] text-white font-bold rounded-xl transition shadow-md flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                        {isSubmitting ? 'Posting...' : 'Post Notice'}
                    </button>
                </form>
            </div>

            <div className={`flex-1 rounded-xl shadow-sm border p-6 ${isDark ? 'bg-[#241a0f] border-orange-900/30' : 'bg-white border-orange-100'}`}>
                <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-[#3e2f1c]'}`}>
                    <i className="fas fa-bullhorn text-[#b8860b] mr-2"></i> Active Notices
                </h3>

                {notices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed rounded-xl border-orange-900/20">
                        <i className="far fa-clipboard text-5xl text-orange-200 dark:text-orange-900/30 mb-4"></i>
                        <p className={`text-lg font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No active notices right now.</p>
                        <p className="text-sm text-gray-500 mt-1">Publish a notice above and it will show up here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {notices.map((notice) => (
                            <motion.div
                                key={notice.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-5 rounded-xl border shadow-sm relative group ${isDark ? 'bg-[#1a1209] border-orange-900/30' : 'bg-[#fff9f2] border-orange-100'}`}
                            >
                                <div className="pr-10">
                                    <h4 className={`font-bold text-lg leading-tight mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{notice.title}</h4>
                                    <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{notice.content}</p>
                                    <span className="text-xs text-gray-400 font-medium tracking-wide uppercase px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full">
                                        {formatDate(notice.created_at)}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleDelete(notice.id)}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white dark:hover:bg-red-500 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                                    title="Delete Notice"
                                >
                                    <i className="fas fa-trash-alt text-sm"></i>
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
