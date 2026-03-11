import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ToastContext';
import { useTheme } from './ThemeContext';

export default function JoinClass() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [regNumber, setRegNumber] = useState('');
    const [branchId, setBranchId] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { showToast } = useToast();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        // Fetch branches on component mount
        const fetchBranches = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/branches');
                if (response.ok) {
                    const data = await response.json();
                    setBranches(data);
                } else {
                    console.error('Failed to fetch branches');
                }
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        };
        fetchBranches();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password || !phone || !branchId || !regNumber) {
            setError('Please fill in all required fields.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('phone', phone);
            formData.append('reg_number', regNumber);
            formData.append('branch_id', branchId);
            
            if (image) {
                formData.append('image', image);
            }

            const response = await fetch('http://localhost:5000/api/register-student', {
                method: 'POST',
                body: formData, // Do NOT set Content-Type header manually when sending FormData
            });

            if (response.ok) {
                const data = await response.json();
                showToast('Successfully joined class! Please log in.', 'success');
                navigate('/user-login');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Registration failed');
                showToast(errorData.error || 'Registration failed', 'error');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('An unexpected network error occurred.');
            showToast('An unexpected network error occurred.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen pt-28 pb-16 flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-[#1a1209]' : 'bg-[#fff9f2]'}`}>
            <div className={`p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-2xl border ${isDark ? 'bg-[#241a0f] border-orange-900/30 shadow-orange-900/10' : 'bg-white border-orange-100 shadow-orange-100/50'}`}>
                
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#b8860b] to-[#e6a800] text-white shadow-lg shadow-orange-500/30 mb-5">
                        <i className="fas fa-graduation-cap text-2xl"></i>
                    </div>
                    <h2 className={`text-3xl md:text-4xl font-extrabold mb-3 tracking-tight ${isDark ? 'text-white' : 'text-[#3e2f1c]'}`}>
                        Join a Class
                    </h2>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Complete your student profile to get started
                    </p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg text-red-700 dark:text-red-400 text-sm font-medium animate-fadeIn">
                        <i className="fas fa-exclamation-circle mr-2"></i> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Profile Photo Upload */}
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="relative group">
                            <div className={`w-32 h-32 rounded-full overflow-hidden border-4 flex items-center justify-center transition-all duration-300 ${isDark ? 'bg-[#1a1209] border-gray-700 group-hover:border-[#b8860b]' : 'bg-gray-100 border-gray-200 group-hover:border-[#b8860b]'}`}>
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <i className="fas fa-camera text-4xl text-gray-400 group-hover:text-[#b8860b] transition-colors"></i>
                                )}
                            </div>
                            <label htmlFor="photo-upload" className="absolute bottom-1 right-1 bg-[#b8860b] hover:bg-[#9a7009] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-110">
                                <i className="fas fa-plus"></i>
                            </label>
                            <input 
                                id="photo-upload" 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleImageChange} 
                            />
                        </div>
                        <p className={`text-sm mt-3 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Upload Profile Photo</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className={`fas fa-user ${isDark ? 'text-gray-500 group-focus-within:text-[#b8860b]' : 'text-gray-400 group-focus-within:text-[#b8860b]'} transition-colors`}></i>
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-0 focus:border-[#b8860b] transition-all bg-transparent ${isDark ? 'border-gray-700 text-white hover:border-gray-600' : 'border-gray-200 text-gray-900 hover:border-gray-300'}`}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className={`fas fa-envelope ${isDark ? 'text-gray-500 group-focus-within:text-[#b8860b]' : 'text-gray-400 group-focus-within:text-[#b8860b]'} transition-colors`}></i>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-0 focus:border-[#b8860b] transition-all bg-transparent ${isDark ? 'border-gray-700 text-white hover:border-gray-600' : 'border-gray-200 text-gray-900 hover:border-gray-300'}`}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className={`fas fa-phone ${isDark ? 'text-gray-500 group-focus-within:text-[#b8860b]' : 'text-gray-400 group-focus-within:text-[#b8860b]'} transition-colors`}></i>
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-0 focus:border-[#b8860b] transition-all bg-transparent ${isDark ? 'border-gray-700 text-white hover:border-gray-600' : 'border-gray-200 text-gray-900 hover:border-gray-300'}`}
                                    placeholder="+1 234 567 8900"
                                    required
                                />
                            </div>
                        </div>

                        {/* Register Number */}
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Register Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className={`fas fa-id-card ${isDark ? 'text-gray-500 group-focus-within:text-[#b8860b]' : 'text-gray-400 group-focus-within:text-[#b8860b]'} transition-colors`}></i>
                                </div>
                                <input
                                    type="text"
                                    value={regNumber}
                                    onChange={(e) => setRegNumber(e.target.value)}
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-0 focus:border-[#b8860b] transition-all bg-transparent ${isDark ? 'border-gray-700 text-white hover:border-gray-600' : 'border-gray-200 text-gray-900 hover:border-gray-300'}`}
                                    placeholder="e.g. STU12345"
                                    required
                                />
                            </div>
                        </div>

                        {/* Branch Selection */}
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Select Branch <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className={`fas fa-code-branch ${isDark ? 'text-gray-500 group-focus-within:text-[#b8860b]' : 'text-gray-400 group-focus-within:text-[#b8860b]'} transition-colors`}></i>
                                </div>
                                <select
                                    value={branchId}
                                    onChange={(e) => setBranchId(e.target.value)}
                                    className={`w-full pl-11 pr-10 py-3 rounded-xl border-2 focus:outline-none focus:ring-0 focus:border-[#b8860b] transition-all bg-transparent appearance-none cursor-pointer ${isDark ? 'border-gray-700 text-white hover:border-gray-600' : 'border-gray-200 text-gray-900 hover:border-gray-300'}`}
                                    required
                                >
                                    <option value="" disabled className={isDark ? 'bg-gray-800' : ''}>Select your primary branch</option>
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id} className={isDark ? 'bg-gray-800' : ''}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <i className={`fas fa-chevron-down text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}></i>
                                </div>
                            </div>
                        </div>

                        {/* Password (Full Width) */}
                        <div className="md:col-span-2">
                            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Create Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className={`fas fa-lock ${isDark ? 'text-gray-500 group-focus-within:text-[#b8860b]' : 'text-gray-400 group-focus-within:text-[#b8860b]'} transition-colors`}></i>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-0 focus:border-[#b8860b] transition-all bg-transparent ${isDark ? 'border-gray-700 text-white hover:border-gray-600' : 'border-gray-200 text-gray-900 hover:border-gray-300'}`}
                                    placeholder="Min. 6 characters"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-gradient-to-r from-[#b8860b] to-[#e6a800] hover:from-[#9a7009] hover:to-[#cc9900] text-white py-3.5 px-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 cursor-not-allowed transform-none' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <i className="fas fa-circle-notch fa-spin"></i> Processing...
                                </>
                            ) : (
                                <>
                                    Complete Registration <i className="fas fa-arrow-right"></i>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center border-t pt-6 border-opacity-50 dark:border-gray-800">
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} flex items-center justify-center gap-2`}>
                        Already a student?{' '}
                        <a href="/user-login" className="text-[#b8860b] hover:text-[#d4a83e] hover:underline font-bold transition-colors">
                            Sign in to your account
                        </a>
                    </p>
                </div>
            </div>
            <style>{`
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
