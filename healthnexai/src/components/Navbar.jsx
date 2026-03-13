import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const toast = useToast(); // ← FIXED: Removed destructuring
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully. See you soon!');
    navigate('/');
    setMobileMenuOpen(false);
    setShowProfileMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = () => {
    if (!user?.name) return 'from-cyan-500 to-teal-500';
    const colors = [
      'from-cyan-500 to-teal-500',
      'from-blue-500 to-cyan-500',
      'from-teal-500 to-emerald-500',
      'from-indigo-500 to-blue-500',
      'from-purple-500 to-indigo-500',
    ];
    const index = user.name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* LEFT: Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500 rounded-lg opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-500 via-teal-600 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 dark:from-cyan-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent tracking-tight leading-tight">
                HealthnexAI
              </span>
              <span className="text-[9px] text-gray-500 dark:text-gray-400 font-medium -mt-0.5 tracking-wider uppercase">
                AI Health Platform
              </span>
            </div>
          </Link>

          {/* CENTER: Navigation */}
          <div className="hidden md:flex items-center space-x-1.5">
            {[
              { to: '/', label: 'Home', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
              { to: '/dashboard', label: 'Dashboard', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
              { to: '/nexai', label: 'NexAI', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> },
            ].map(({ to, label, icon }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className="relative px-4 py-1.5 rounded-lg font-semibold text-sm group"
                >
                  <span
                    className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-r from-cyan-500 to-teal-500"
                    style={{
                      opacity: active ? 1 : 0,
                      transition: 'opacity 180ms ease',
                      transform: 'translateZ(0)',
                      willChange: 'opacity',
                    }}
                  />
                  <span
                    className={`absolute inset-0 rounded-lg pointer-events-none bg-gray-100 dark:bg-gray-800
                      transition-opacity duration-[180ms] ease-in-out
                      ${active ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
                    style={{ transform: 'translateZ(0)', willChange: 'opacity' }}
                  />
                  <span
                    className="relative z-10 flex items-center space-x-1.5 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                    style={{ color: active ? '#ffffff' : undefined }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                    <span>{label}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          {/* RIGHT: Theme + Auth */}
          <div className="flex items-center space-x-3">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="group relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 overflow-hidden"
              aria-label="Toggle theme"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-orange-200 dark:from-indigo-600 dark:to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              {isDarkMode ? (
                <svg className="w-4 h-4 text-yellow-500 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-indigo-600 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Auth Section */}
            {!isAuthenticated ? (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="group relative px-5 py-2 rounded-lg font-semibold text-sm text-white overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500 group-hover:scale-110 transition-transform duration-300"></div>
                  <span className="relative z-10 flex items-center space-x-1">
                    <span>Get Started</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center">
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="group relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                    aria-label="Open profile menu"
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-gray-900 group-hover:shadow-lg transition-all duration-200`}>
                      {getUserInitials()}
                    </div>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                      <div className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                            {getUserInitials()}
                          </div>
                          <div className="w-full">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                              {user?.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {user?.email}
                            </p>
                          </div>
                          <Link
                            to="/profile"
                            onClick={() => setShowProfileMenu(false)}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                          >
                            Manage your account
                          </Link>
                        </div>
                      </div>
                      <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            handleLogout();
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          </div>
                          <p className="font-medium">Sign out</p>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-xl">
            <div className="flex flex-col space-y-1.5 px-2 max-h-[70vh] overflow-y-auto">
              
              {isAuthenticated ? (
                <>
                  {/* User Profile Card - FIRST */}
                  <div className="px-4 py-3 bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getAvatarColor()} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                        {getUserInitials()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
                </>
              ) : null}

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  isActive('/') ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  isActive('/dashboard') ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Dashboard</span>
              </Link>

              <Link
                to="/nexai"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  isActive('/nexai') ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>NexAI</span>
              </Link>

              {isAuthenticated && (
                <>
                  <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>

                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg font-semibold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/results"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg font-semibold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>My Results</span>
                  </Link>

                  <Link
                    to="/history"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg font-semibold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Assessment History</span>
                  </Link>

                  <Link
                    to="/assessment"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg font-semibold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>New Assessment</span>
                  </Link>

                  <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>

                  <button
                    onClick={handleLogout}
                    className="mx-1 flex items-center justify-center space-x-2 px-3 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-semibold text-sm shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg font-semibold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Login</span>
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mx-1 flex items-center justify-center space-x-1.5 px-3 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-semibold text-sm shadow-md"
                  >
                    <span>Get Started</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;