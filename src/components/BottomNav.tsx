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
  FormInput
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BottomNav = () => {
  const { user, signOut } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = user ? [
    { icon: <Home size={24} />, label: 'Home', to: '/' },
    { icon: <Layout size={24} />, label: 'Dashboard', to: '/dashboard' },
    { icon: <User size={24} />, label: 'Profile', to: '/profile' },
    { icon: <LogOut size={24} />, label: 'Sign Out', onClick: signOut }
  ] : [
    { icon: <Home size={24} />, label: 'Home', to: '/' },
    { icon: <FormInput size={24} />, label: 'Sign In', to: '/login' }
  ];

  return (
    <>
      {/* Overlay */}
      {showMenu && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-4 left-4 right-4 z-50">
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

          {/* Expandable Menu */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute bottom-full mb-2 left-0 right-0 bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="p-4 space-y-2">
                  {menuItems.slice(3).map((item, index) => (
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