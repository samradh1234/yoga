import Navbar from './Header';  // Navbar
import Footer from './Footer';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import Classes from './Classes';
import Gallery from './Gallery';
import SectionWrapper from './SectionWrapper';
import AdminDashboard from './AdminDashboard';
import AdminDashboardHome from './AdminDashboardHome';
import AdminMembersGallery from './AdminMembersGallery';
import AdminNotices from './AdminNotices';
import AdminBranches from './AdminBranches';
import NoticePopup from './NoticePopup';
import PublicNotices from './PublicNotices';
import UserLogin from './UserLogin';
import UserRegister from './UserRegister';
import JoinClass from './JoinClass';
import AdminLogin from './AdminLogin';
import UserCommunity from './UserCommunity';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin-login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Website Route */}
        <Route path="/" element={
          <div className="min-h-screen text-gray-900 dark:bg-[#1a1209] dark:text-gray-200 font-sans flex flex-col transition-colors duration-500">
            <Navbar />
            <NoticePopup />
            <main className="flex-grow w-full">
              <SectionWrapper id="home" direction="up" fullWidth={true}><Home /></SectionWrapper>
              <SectionWrapper id="about" direction="left"><About /></SectionWrapper>
              <SectionWrapper id="classes" direction="right"><Classes /></SectionWrapper>
              <SectionWrapper id="gallery" direction="down" fullWidth={true}><Gallery /></SectionWrapper>
              <SectionWrapper id="contact" direction="up"><Contact /></SectionWrapper>
            </main>
            <Footer />
          </div>
        } />

        {/* Standalone Public Routes */}
        <Route path="/notices" element={
          <div className="min-h-screen text-gray-900 dark:bg-[#1a1209] dark:text-gray-200 font-sans flex flex-col transition-colors duration-500">
            <Navbar />
            <main className="flex-grow w-full">
              <PublicNotices />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/join-class" element={
          <div className="min-h-screen text-gray-900 dark:bg-[#1a1209] dark:text-gray-200 font-sans flex flex-col transition-colors duration-500">
            <Navbar />
            <main className="flex-grow w-full">
              <JoinClass />
            </main>
            <Footer />
          </div>
        } />
        
        {/* User Protected Routes outside Admin Dashboard */}
        <Route path="/branches" element={
          <ProtectedRoute>
            <div className="min-h-screen text-gray-900 dark:bg-[#1a1209] dark:text-gray-200 font-sans flex flex-col transition-colors duration-500">
              <Navbar />
              <main className="flex-grow w-full pt-28 pb-16">
                <AdminBranches />
              </main>
              <Footer />
            </div>
          </ProtectedRoute>
        } />

        {/* Auth Routes */}
        <Route path="/login" element={<Navigate to="/admin-login" replace />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/community" element={<UserCommunity />} />

        {/* Admin Dashboard Protected Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboardHome />} />
          <Route path="members" element={<AdminMembersGallery />} />
          <Route path="notices" element={<AdminNotices />} />
          <Route path="branches" element={<AdminBranches />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
