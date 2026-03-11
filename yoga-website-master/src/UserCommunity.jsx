import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';

export default function UserCommunity() {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const navigate = useNavigate();

    const [feedbacks, setFeedbacks] = useState([]);
    const [feedback, setFeedback] = useState({ category: 'general', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editMessage, setEditMessage] = useState('');

    // Emoji Picker state
    const [showPicker, setShowPicker] = useState(false);
    const [showEditPicker, setShowEditPicker] = useState(false);

    const onEmojiClick = (emojiObject) => {
        setFeedback(prev => ({ ...prev, message: prev.message + emojiObject.emoji }));
    };

    const onEditEmojiClick = (emojiObject) => {
        setEditMessage(prev => prev + emojiObject.emoji);
    };

    const fetchFeedbacks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/feedbacks');
            if (response.ok) {
                const data = await response.json();
                setFeedbacks(data);
            }
        } catch (err) {
            console.error("Error fetching feedbacks:", err);
        }
    };

    React.useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        if (!user) return;
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/feedbacks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(feedback)
            });

            if (response.ok) {
                setSubmitted(true);
                setFeedback({ category: 'general', message: '' });
                fetchFeedbacks();
                setTimeout(() => setSubmitted(false), 5000);
            }
        } catch (err) {
            console.error("Error submitting feedback:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/feedbacks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchFeedbacks();
            } else {
                alert("Failed to delete comment");
            }
        } catch (err) {
            console.error("Error deleting feedback:", err);
        }
    };

    const startEditing = (fb) => {
        setEditingId(fb.id);
        setEditMessage(fb.message);
    };

    const submitEdit = async (id) => {
        if (!editMessage.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/feedbacks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: editMessage })
            });

            if (response.ok) {
                setEditingId(null);
                fetchFeedbacks();
            } else {
                alert("Failed to update comment");
            }
        } catch (err) {
            console.error("Error updating feedback:", err);
        }
    };

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#1a1209] text-gray-100' : 'bg-[#fff9f2] text-[#3e2f1c]'}`}>
            {/* Header */}
            <header className={`p-6 border-b sticky top-0 z-50 backdrop-blur-md ${isDark ? 'bg-[#241a0f]/80 border-orange-900/30' : 'bg-white/80 border-orange-100'}`}>
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-8">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-[#b8860b]">
                                <path d="M12 2C6.48 2 2 6.48 2 12s10 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c0 0-8-4.48-8-8s3.58-8 8-8 8 3.58 8 8-8 8-8 8z" opacity="0.6" />
                                <path d="M12 2C9 2 6 6.48 6 12s6 10 6 10 6-4.48 6-10S15 2 12 2z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold tracking-widest uppercase">Community</h1>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-semibold">
                        <Link to="/" className="hover:text-[#b8860b] transition">Home</Link>
                        <Link to="/notices" className="hover:text-[#b8860b] transition">Notice</Link>
                        {user ? (
                            <button onClick={handleLogout} className="text-red-500 hover:text-red-400">Logout</button>
                        ) : (
                            <Link to="/login" className="text-[#b8860b] hover:text-[#9a7009]">Join Us</Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6 md:p-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-12"
                >
                    {/* Welcome Section */}
                    <div className="lg:col-span-3">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Community Voice</h2>
                        <p className={`text-xl max-w-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Welcome to the space where our community shares their experiences and journey.
                        </p>
                    </div>

                    {/* Feed Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                            <i className="fas fa-stream text-[#b8860b]"></i> Recent Updates
                        </h3>

                        <div className="space-y-6">
                            {feedbacks.length === 0 ? (
                                <div className={`p-12 rounded-3xl border-2 border-dashed flex flex-col items-center text-center ${isDark ? 'border-orange-900/20 text-gray-500' : 'border-orange-100 text-gray-400'}`}>
                                    <i className="far fa-comment-alt text-4xl mb-4"></i>
                                    <p>No community feedback yet. Be the first to share!</p>
                                </div>
                            ) : (
                                feedbacks.map((fb) => (
                                    <motion.div
                                        key={fb.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`p-6 rounded-3xl border shadow-sm ${isDark ? 'bg-[#241a0f] border-orange-900/30' : 'bg-white border-orange-100'}`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#b8860b]/20 text-[#b8860b] flex items-center justify-center font-bold">
                                                    {fb.user_name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold">{fb.user_name}</p>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider">{fb.category}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs text-gray-400 font-medium">{formatDate(fb.created_at)}</span>
                                                {user && (
                                                    <div className="flex gap-2">
                                                        {user.id === fb.user_id && (
                                                            <button
                                                                onClick={() => startEditing(fb)}
                                                                className="text-gray-400 hover:text-[#b8860b] transition p-1"
                                                                title="Edit"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                        )}
                                                        {(user.id === fb.user_id || user.role === 'admin') && (
                                                            <button
                                                                onClick={() => handleDelete(fb.id)}
                                                                className="text-gray-400 hover:text-red-500 transition p-1"
                                                                title="Delete"
                                                            >
                                                                <i className="fas fa-trash-alt"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {editingId === fb.id ? (
                                            <div className="space-y-3 mt-4">
                                                <div className="relative">
                                                    <textarea
                                                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#b8860b]/50 transition pr-12 ${isDark ? 'bg-[#1a1209] border-orange-900/30 text-white' : 'bg-[#fff9f2] border-orange-100 text-[#3e2f1c]'}`}
                                                        rows="3"
                                                        value={editMessage}
                                                        onChange={(e) => setEditMessage(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowEditPicker(!showEditPicker)}
                                                        className="absolute right-3 top-3 text-gray-400 hover:text-[#b8860b] text-xl transition"
                                                    >
                                                        <i className="far fa-smile"></i>
                                                    </button>
                                                    {showEditPicker && (
                                                        <div className="absolute right-0 top-14 z-50 shadow-2xl rounded-lg overflow-hidden">
                                                            <EmojiPicker
                                                                onEmojiClick={onEditEmojiClick}
                                                                theme={isDark ? 'dark' : 'light'}
                                                                lazyLoadEmojis={true}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => submitEdit(fb.id)}
                                                        className="px-4 py-2 text-sm font-bold bg-[#b8860b] hover:bg-[#9a7009] text-white rounded-lg transition"
                                                    >
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-[#3e2f1c]'}`}>
                                                "{fb.message}"
                                            </p>
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Join/Post */}
                    <div className="space-y-8">
                        {user ? (
                            <div className={`p-8 rounded-3xl shadow-sm border ${isDark ? 'bg-[#241a0f] border-orange-900/30' : 'bg-white border-orange-100'}`}>
                                <h3 className="text-xl font-bold mb-6">Share Your Experience</h3>
                                {submitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-green-100/10 text-green-600 p-6 rounded-2xl flex flex-col items-center text-center border border-green-100"
                                    >
                                        <i className="fas fa-check-circle text-3xl mb-3"></i>
                                        <p className="font-bold">Sent successfully!</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmitFeedback} className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-50">Topic</label>
                                            <select
                                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#b8860b]/50 transition ${isDark ? 'bg-[#1a1209] border-orange-900/30' : 'bg-[#fff9f2] border-orange-100'}`}
                                                value={feedback.category}
                                                onChange={(e) => setFeedback({ ...feedback, category: e.target.value })}
                                            >
                                                <option value="general">General</option>
                                                <option value="class">Classes</option>
                                                <option value="vibe">Vibe</option>
                                                <option value="suggestion">Suggestion</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-50">Message</label>
                                            <div className="relative">
                                                <textarea
                                                    rows="4"
                                                    required
                                                    placeholder="What's on your mind?"
                                                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#b8860b]/50 transition pr-12 ${isDark ? 'bg-[#1a1209] border-orange-900/30 text-white' : 'bg-[#fff9f2] border-orange-100 text-[#3e2f1c]'}`}
                                                    value={feedback.message}
                                                    onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                                                ></textarea>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPicker(!showPicker)}
                                                    className="absolute right-3 top-3 text-gray-400 hover:text-[#b8860b] text-xl transition"
                                                >
                                                    <i className="far fa-smile"></i>
                                                </button>
                                                {showPicker && (
                                                    <div className="absolute right-0 top-14 z-50 shadow-2xl rounded-lg overflow-hidden">
                                                        <EmojiPicker
                                                            onEmojiClick={onEmojiClick}
                                                            theme={isDark ? 'dark' : 'light'}
                                                            lazyLoadEmojis={true}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-4 bg-[#b8860b] hover:bg-[#9a7009] text-white font-bold rounded-2xl transition shadow-lg flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : 'Post Comment'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        ) : (
                            <div className={`p-8 rounded-3xl shadow-sm border text-center ${isDark ? 'bg-[#241a0f] border-orange-900/30' : 'bg-white border-orange-100'}`}>
                                <div className="w-16 h-16 rounded-full bg-orange-100 text-[#b8860b] flex items-center justify-center mx-auto mb-6 text-2xl">
                                    <i className="fas fa-lock"></i>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Join the Community</h3>
                                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Want to share your story? Log in to join the conversation and help others!
                                </p>
                                <Link
                                    to="/login"
                                    className="block w-full py-4 bg-[#b8860b] hover:bg-[#9a7009] text-white font-bold rounded-2xl transition shadow-lg"
                                >
                                    Log In to Post
                                </Link>
                            </div>
                        )}

                        <div className={`p-8 rounded-3xl shadow-sm border ${isDark ? 'bg-[#b8860b]/5 border-orange-900/30' : 'bg-orange-50 border-orange-100'}`}>
                            <h4 className="font-bold mb-4 flex items-center gap-2">
                                <i className="fas fa-info-circle text-[#b8860b]"></i> Guidelines
                            </h4>
                            <ul className="text-sm space-y-3 text-gray-500">
                                <li className="flex gap-2"><span>•</span> Be respectful and supportive.</li>
                                <li className="flex gap-2"><span>•</span> Share your real yoga journey.</li>
                                <li className="flex gap-2"><span>•</span> Help each other grow.</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
