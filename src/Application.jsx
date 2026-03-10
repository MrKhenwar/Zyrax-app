import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAppStore } from './services/store';
import { fetchClasses, fetchOffers, fetchServicePosts } from './services/api';
import Header from './modules/Header';
import LoginModal from './modules/LoginModal';
import RegisterModal from './modules/RegisterModal';

// Lazy load views
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./views/HomePage'));
const ClassesView = lazy(() => import('./views/ClassesView'));
const ProfileView = lazy(() => import('./views/ProfileView'));
const CommunityView = lazy(() => import('./views/CommunityView'));
const DietView = lazy(() => import('./views/DietView'));

// Loading component
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
  </div>
);

export default function Application() {
  const location = useLocation();
  const { setScheduleData, setOffersAvailable, setServiceItems, setLoading } = useAppStore();

  useEffect(() => {
    async function initializeApp() {
      setLoading(true);
      try {
        // Try to fetch public data, but don't fail if unauthorized
        const results = await Promise.allSettled([
          fetchClasses().catch(() => []),
          fetchOffers().catch(() => []),
          fetchServicePosts().catch(() => [])
        ]);

        if (results[0].status === 'fulfilled') setScheduleData(results[0].value);
        if (results[1].status === 'fulfilled') setOffersAvailable(results[1].value);
        if (results[2].status === 'fulfilled') setServiceItems(results[2].value);
      } catch (error) {
        console.log('App initialized without data - will load on demand');
      } finally {
        setLoading(false);
      }
    }

    initializeApp();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/classes" element={<ClassesView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/community" element={<CommunityView />} />
          <Route path="/diet" element={<DietView />} />
        </Routes>
      </Suspense>

      {/* Global Modals */}
      <LoginModal />
      <RegisterModal />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

// Mobile Bottom Navigation Component
function MobileBottomNav() {
  const location = useLocation();
  const { authenticated, toggleModal } = useAppStore();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-4 py-2 z-40">
      <div className="flex items-center justify-around">
        <a
          href="/"
          className={`flex flex-col items-center py-2 ${isActive('/') ? 'text-pink-500' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs">Home</span>
        </a>
        <a
          href="/classes"
          className={`flex flex-col items-center py-2 ${isActive('/classes') ? 'text-pink-500' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs">Classes</span>
        </a>
        <a
          href="/community"
          className={`flex flex-col items-center py-2 ${isActive('/community') ? 'text-pink-500' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-xs">Community</span>
        </a>
        <a
          href="/diet"
          className={`flex flex-col items-center py-2 ${isActive('/diet') ? 'text-pink-500' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-xs">Diet</span>
        </a>
        {authenticated ? (
          <a
            href="/profile"
            className={`flex flex-col items-center py-2 ${isActive('/profile') ? 'text-pink-500' : 'text-gray-400'}`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Profile</span>
          </a>
        ) : (
          <button
            onClick={() => toggleModal('login', true)}
            className="flex flex-col items-center py-2 text-gray-400"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span className="text-xs">Login</span>
          </button>
        )}
      </div>
    </div>
  );
}
