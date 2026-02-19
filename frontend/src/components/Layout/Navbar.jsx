/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Menu, 
  X, 
  Home, 
  Sparkles, 
  Info, 
  Bot, 
  Mail,
  LogIn 
} from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/features', label: 'Features', icon: Sparkles },
    { href: '/about', label: 'About', icon: Info },
    { href: '/ai-space', label: 'AI Space', icon: Bot },
    { href: '/contact', label: 'Contact', icon: Mail },
  ];

  return (
    <motion.header
      className="bg-green-600 shadow-lg relative z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <a href="/" className="flex items-center space-x-3 cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <MessageCircle className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Chatify</h1>
                <p className="text-green-100 text-sm">Simple. Reliable. Private.</p>
              </div>
            </a>
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center space-x-2 text-white hover:text-green-200 transition-colors font-medium cursor-pointer px-3 py-2 rounded-lg hover:bg-green-700/50"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          {/* Desktop Sign In Button */}
          <motion.div
            className="hidden md:block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="/login"
              className="inline-flex items-center space-x-2 px-6 py-2 bg-white text-green-600 rounded-full font-semibold hover:bg-green-50 transition-all duration-300 shadow-lg cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </a>
          </motion.div>

          {/* Mobile Hamburger Menu Button */}
          <motion.button
            className="md:hidden text-white p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <Menu className="w-8 h-8" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              className="md:hidden absolute top-full left-0 right-0 bg-green-600 shadow-xl z-50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-6 space-y-4">
                {/* Close Button */}
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeMobileMenu}
                    className="text-white p-2"
                    aria-label="Close menu"
                  >
                    <X className="w-8 h-8" />
                  </motion.button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      className="flex items-center space-x-3 text-white text-lg font-medium hover:text-green-200 transition-colors cursor-pointer py-3 px-4 rounded-lg hover:bg-green-700/50"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={closeMobileMenu}
                    >
                      <link.icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </motion.a>
                  ))}
                </nav>

                {/* Mobile Sign In Button */}
                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  <a
                    href="/login"
                    className="flex items-center justify-center space-x-2 w-full text-center px-6 py-3 bg-white text-green-600 rounded-full font-semibold hover:bg-green-50 transition-all duration-300 shadow-lg cursor-pointer"
                    onClick={closeMobileMenu}
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;

