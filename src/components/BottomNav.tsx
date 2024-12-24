import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  Home,
  Layout,
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

export const BottomNav = () => {
  const { user, signOut } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = user ? [
    { icon: <Home size={24} />, label: 'Home', to: '/' },
    { icon: <Layout size={24} />, label: 'Dashboard', to: '/dashboard' },
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

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 hidden lg:flex">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: showMenu ? 280 : 72 }}
          className="h-full bg-white/80 backdrop-blur-lg border-r border-gray-200/50 flex flex-col"
        >
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <FormInput className="h-6 w-6 text-white" />
              </div>
              <AnimatePresence>
                {showMenu && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-semibold text-gray-900"
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
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 relative group"
              >
                <div className="flex items-center justify-center w-10">
                  {item.icon}
                </div>
                <AnimatePresence>
                  {showMenu && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!showMenu && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </div>
                )}
              </Link>
            ))}
          </div>

          {user && (
            <div className="p-4 border-t border-gray-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium">
                  {user.email?.[0].toUpperCase()}
                </div>
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 min-w-0"
                    >
                      <div className="truncate text-sm font-medium text-gray-900">
                        {user.email}
                      </div>
                      <div className="text-xs text-gray-500">Personal Plan</div>
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
                          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ) : (
                        <button
                          key={index}
                          onClick={item.onClick}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full"
                        >
                          {item.icon}
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
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50"
          >
            <ChevronRight
              size={14}
              className={`transform transition-transform ${showMenu ? 'rotate-180' : ''}`}
            />
          </button>
        </motion.div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-4 left-4 right-4 lg:hidden z-50">
        <nav className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="flex items-center justify-around h-16">
              {menuItems.slice(0, 3).map((item, index) => (
                item.to ? (
                  <Link
                    key={index}
                    to={item.to}
                    className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-all transform hover:scale-110"
                  >
                    {item.icon}
                    <span className="text-xs mt-1 font-medium">{item.label}</span>
                  </Link>
                ) : (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-all transform hover:scale-110"
                  >
                    {item.icon}
                    <span className="text-xs mt-1 font-medium">{item.label}</span>
                  </button>
                )
              ))}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-all transform hover:scale-110"
              >
                {showMenu ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
                <span className="text-xs mt-1 font-medium">Menu</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute bottom-full mb-2 left-0 right-0 bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="p-4 space-y-2">
                  {settingsItems.map((item, index) => (
                    item.to ? (
                      <Link
                        key={index}
                        to={item.to}
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/50 transition-all"
                        onClick={() => setShowMenu(false)}
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ) : (
                      <button
                        key={index}
                        onClick={() => {
                          item.onClick?.();
                          setShowMenu(false);
                        }}
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/50 transition-all w-full"
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </button>
                    )
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </>
  );
};