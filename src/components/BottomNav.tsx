import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  Home,
  User,
  LogOut,
  Menu,
  X,
  FormInput,
  Settings,
  HelpCircle,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from './navigation/useClickOutside';

export const BottomNav = () => {
  const { user, signOut } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();

  // Use custom hook to handle clicks outside the menu
  useClickOutside(menuRef, () => {
    if (!buttonRef.current?.contains(event?.target as Node)) {
      handleCloseMenu();
    }
  });

  const handleCloseMenu = () => {
    if (!isHovered) {
      setShowMenu(false);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowMenu(true);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Add a delay before closing the menu
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHovered) {
        handleCloseMenu();
      }
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const menuItems = user ? [
    { icon: <Home size={24} />, label: 'Dashboard', to: '/dashboard' },
    { icon: <User size={24} />, label: 'Profile', to: '/profile' },
  ] : [
    { icon: <Home size={24} />, label: 'Home', to: '/' },
    { icon: <FormInput size={24} />, label: 'Sign In', to: '/login' }
  ];

  const settingsItems = [
    { icon: <Settings size={20} />, label: 'Settings', to: '/settings' },
    { icon: <HelpCircle size={20} />, label: 'Help Center', to: '/help' },
    { icon: <CreditCard size={20} />, label: 'Subscription', to: '/subscription' },
    { icon: <LogOut size={20} />, label: 'Sign Out', onClick: signOut }
  ];

  // Don't show navigation on auth pages and public form pages
  const hideNav = ['/login', '/register', '/forgot-password'].includes(location.pathname) ||
    location.pathname.startsWith('/form/') ||
    location.pathname.startsWith('/embed/');

  if (hideNav) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <div 
        className="fixed left-0 top-0 bottom-0 hidden lg:flex z-50"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          initial={{ width: 72 }}
          animate={{ width: showMenu ? 280 : 72 }}
          transition={{ duration: 0.2 }}
          className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg relative"
        >
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-2 shadow-lg">
                <FormInput className="h-6 w-6 text-white" />
              </div>
              <AnimatePresence>
                {showMenu && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-semibold text-gray-900 dark:text-white"
                  >
                    FormBuilder
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex-1 py-4">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                onClick={() => setShowMenu(false)}
                className={`flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative group transition-all duration-200 ${
                  location.pathname === item.to ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : ''
                }`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 group-hover:scale-110 ${
                  location.pathname === item.to ? 'text-blue-600 dark:text-blue-400' : ''
                }`}>
                  {item.icon}
                </div>
                <AnimatePresence>
                  {showMenu && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!showMenu && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {item.label}
                  </div>
                )}
              </Link>
            ))}
          </div>

          {user && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium shadow-lg">
                  {user.email?.[0].toUpperCase()}
                </div>
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex-1 min-w-0"
                    >
                      <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {user.email}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Personal Plan</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-1"
                  >
                    {settingsItems.map((item, index) => (
                      item.to ? (
                        <Link
                          key={index}
                          to={item.to}
                          onClick={() => setShowMenu(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg group transition-all duration-200"
                        >
                          <div className="p-1.5 rounded-lg bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 group-hover:scale-110">
                            {item.icon}
                          </div>
                          {item.label}
                        </Link>
                      ) : (
                        <button
                          key={index}
                          onClick={() => {
                            item.onClick?.();
                            setShowMenu(false);
                          }}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg w-full group transition-all duration-200"
                        >
                          <div className="p-1.5 rounded-lg bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 group-hover:scale-110">
                            {item.icon}
                          </div>
                          {item.label}
                        </button>
                      )
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg transform transition-all duration-200 hover:scale-110"
          >
            <ChevronRight
              size={14}
              className={`transform transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`}
            />
          </button>
        </motion.div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden z-50">
        <div className="flex items-center justify-around px-4 py-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${
                location.pathname === item.to 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
          {user && (
            <button
              ref={buttonRef}
              onClick={() => setShowMenu(!showMenu)}
              className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400"
            >
              {showMenu ? <X size={24} /> : <Menu size={24} />}
              <span className="text-xs mt-1">Menu</span>
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <div className="p-4 space-y-2">
                {settingsItems.map((item, index) => (
                  item.to ? (
                    <Link
                      key={index}
                      to={item.to}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                      onClick={() => setShowMenu(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={index}
                      onClick={() => {
                        item.onClick?.();
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg w-full transition-colors duration-200"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  )
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};