import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useTheme } from './ThemeContext';
import { useGoogleLogin } from '@react-oauth/google';

export default function UserRegister() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { register, socialLogin } = useAuth();
    const { showToast } = useToast();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            try {
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await userInfoResponse.json();

                const result = await socialLogin('google', tokenResponse.access_token, userInfo.email, userInfo.name, userInfo.picture);
                if (result.success) {
                    showToast('Google registration successful!', 'success');
                    navigate('/community');
                } else {
                    showToast(result.error || 'Google registration failed', 'error');
                }
            } catch (err) {
                showToast('Failed to fetch Google profile', 'error');
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => showToast('Google registration failed', 'error')
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);

        try {
            const result = await register(name, email, password);
            if (result.success) {
                showToast('Registration successful! Please log in.', 'success');
                navigate('/user-login');
            } else {
                showToast(result.error || 'Registration failed', 'error');
                setError(result.error || 'Registration failed');
            }
        } catch (err) {
            showToast('An unexpected error occurred.', 'error');
            setError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen pt-24 pb-12 flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-[#fff9f2]'}`}>
            <div className={`p-8 rounded-2xl shadow-xl w-full max-w-md border ${isDark ? 'bg-[#2c1d11] border-yellow-900/30' : 'bg-white border-yellow-100'}`}>
                <div className="text-center mb-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>
                        <i className="fas fa-user-plus text-3xl text-[#b8860b]"></i>
                    </div>
                    <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Create Account</h2>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Join our yoga community today</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r text-red-700 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-user text-gray-400"></i>
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#b8860b] focus:border-transparent transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-envelope text-gray-400"></i>
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#b8860b] focus:border-transparent transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-lock text-gray-400"></i>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#b8860b] focus:border-transparent transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-lock text-gray-400"></i>
                            </div>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#b8860b] focus:border-transparent transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-[#b8860b] hover:bg-[#9a7009] text-white py-3 px-4 rounded-xl font-medium transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-6 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <>
                                <i className="fas fa-circle-notch fa-spin"></i> Creating Account...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-user-plus"></i> Sign Up
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className={`px-2 ${isDark ? 'bg-[#2c1d11] text-gray-400' : 'bg-white text-gray-500'}`}>Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={() => handleGoogleLogin()}
                            className={`w-full flex items-center justify-center px-4 py-2 border rounded-xl shadow-sm text-sm font-medium transition-colors ${isDark ? 'border-gray-700 bg-gray-800 text-white hover:bg-gray-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" />
                            Continue with Google
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Already have an account?{' '}
                        <a href="/user-login" className="text-[#b8860b] hover:underline font-medium">
                            Sign in here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
