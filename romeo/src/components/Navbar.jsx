/**
 * Navbar Component
 * Top navigation with theme toggle and route links
 */
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sun, Moon, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

const NAV_LINKS = [
    { path: '/', label: 'Home' },
    { path: '/dataset', label: 'Profiles' },
    { path: '/matches', label: 'Matches' },
    { path: '/parallel-hearts', label: 'Parallel Hearts' },
    { path: '/about', label: 'About' },
];

export default function Navbar() {
    const { theme, toggleTheme } = useApp();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 glass-dark"
            style={{ borderBottom: '1px solid rgba(233,30,140,0.2)' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: 20, scale: 1.2 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <Heart className="w-7 h-7 fill-pink-500 text-pink-500" />
                        </motion.div>
                        <span className="text-xl font-bold gradient-text">Romeo</span>
                        <span className="text-xs text-purple-400 hidden sm:block">AI Matchmaker</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map(link => {
                            const active = location.pathname === link.path;
                            return (
                                <Link key={link.path} to={link.path}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${active
                                                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/25'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {link.label}
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className="p-2 rounded-full glass hover:bg-white/10 transition-colors"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-purple-400" />}
                        </motion.button>

                        {/* Mobile menu button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden p-2 rounded-full glass hover:bg-white/10"
                        >
                            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden glass-dark border-t border-white/10"
                >
                    <div className="px-4 py-4 space-y-1">
                        {NAV_LINKS.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMenuOpen(false)}
                                className={`block px-4 py-2 rounded-xl text-sm font-medium transition-all ${location.pathname === link.path
                                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
