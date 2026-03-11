import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import logo from './assets/polytechnic.png';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
  };

  const navLinks = [
    { name: 'Home', to: '/#home' },
    { name: 'Classes', to: '/#classes' },
    { name: 'About', to: '/#about' },
    { name: 'Gallery', to: '/#gallery' },
    { name: 'Join Class', to: '/join-class' },
    { name: 'Contact', to: '/#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-shadow duration-300 shadow-lg bg-[#cc9900] text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Yoga Bliss Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <a href="#home" className="text-xl font-bold tracking-wide">
            KPT Yoga Club
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            link.to.startsWith('/#') ? (
              <a
                key={link.to}
                href={link.to}
                className="font-medium text-white transition duration-300 hover:text-white/80"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className="font-medium text-white transition duration-300 hover:text-white/80"
              >
                {link.name}
              </Link>
            )
          ))}
          <div className="flex items-center space-x-4 border-l border-white/30 pl-6">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-white hover:text-white/80 transition flex items-center gap-2 font-medium">
                    <i className="fas fa-shield-alt"></i> Dashboard
                  </Link>
                )}
                <Link to="/branches" className="text-white hover:text-white/80 transition flex items-center gap-2 font-medium">
                  <i className="fas fa-building"></i> Branches
                </Link>
                <Link to="/community" className="text-white hover:text-white/80 transition flex items-center gap-2 font-medium">
                  <i className="fas fa-users"></i> Community
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-full text-sm font-bold transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/admin-login" className="text-white hover:text-white/80 transition flex items-center gap-2 font-medium">
                  <i className="fas fa-user-shield"></i> Admin
                </Link>
                <Link to="/user-login" className="text-white hover:text-white/80 transition flex items-center gap-2 font-medium">
                  <i className="fas fa-user-plus"></i> Login / Register
                </Link>
              </>
            )}
            <button onClick={toggleTheme} className="text-white hover:text-white/80 transition px-2">
              {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
            </button>
          </div>
        </nav>

        {/* Mobile Hamburger Layout */}
        <div className="md:hidden flex items-center space-x-4">
          <button onClick={toggleTheme} className="text-white hover:text-white/80 transition">
            {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="focus:outline-none flex flex-col justify-between w-6 h-5"
          >
            <span
              className={`block h-0.5 w-full bg-white transform transition duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
            ></span>
            <span
              className={`block h-0.5 w-full bg-white transition duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''
                }`}
            ></span>
            <span
              className={`block h-0.5 w-full bg-white transform transition duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden mt-2 space-y-3 px-4 py-4 rounded-b-lg shadow-lg animate-fadeIn bg-[#cc9900]`}>
          {navLinks.map((link) => (
            link.to.startsWith('/#') ? (
              <a
                key={link.to}
                href={link.to}
                className="block font-medium text-white transition duration-300 hover:text-white/80"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className="block font-medium text-white transition duration-300 hover:text-white/80"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            )
          ))}
        </div>
      )}

      {/* Animation */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
