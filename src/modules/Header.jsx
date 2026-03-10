import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../services/store';

export default function Header() {
  const location = useLocation();
  const { authenticated, toggleModal } = useAppStore();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              ZYRAX
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`${
                isActive('/') ? 'text-pink-500' : 'text-gray-300 hover:text-white'
              } transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/classes"
              className={`${
                isActive('/classes') ? 'text-pink-500' : 'text-gray-300 hover:text-white'
              } transition-colors`}
            >
              Classes
            </Link>
            <Link
              to="/community"
              className={`${
                isActive('/community') ? 'text-pink-500' : 'text-gray-300 hover:text-white'
              } transition-colors`}
            >
              Community
            </Link>
            {authenticated ? (
              <Link
                to="/profile"
                className={`${
                  isActive('/profile') ? 'text-pink-500' : 'text-gray-300 hover:text-white'
                } transition-colors`}
              >
                Profile
              </Link>
            ) : (
              <button
                onClick={() => toggleModal('login', true)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all"
              >
                Sign In
              </button>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            {!authenticated && (
              <button
                onClick={() => toggleModal('login', true)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-4 py-2 z-50">
        <div className="flex items-center justify-around">
          <Link
            to="/"
            className={`flex flex-col items-center py-2 ${
              isActive('/') ? 'text-pink-500' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/classes"
            className={`flex flex-col items-center py-2 ${
              isActive('/classes') ? 'text-pink-500' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">Classes</span>
          </Link>
          <Link
            to="/community"
            className={`flex flex-col items-center py-2 ${
              isActive('/community') ? 'text-pink-500' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs">Community</span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center py-2 ${
              isActive('/profile') ? 'text-pink-500' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
