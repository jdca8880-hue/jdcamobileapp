import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useCricket } from '../../context/CricketContext';

/**
 * ThemeToggle Component
 * Supports two variants:
 * - 'floating' (default): Sleek glassmorphic floating toggle button
 * - 'switch': Full-width menu toggle item with switch pill (for Sidebar & Drawer)
 */
export default function ThemeToggle({ variant = 'floating', className = '' }) {
  const { isDarkMode, setIsDarkMode } = useCricket();

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  if (variant === 'switch') {
    return (
      <button
        type="button"
        id="theme-toggle-switch"
        onClick={toggleTheme}
        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150 group ${className}`}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          color: '#F3F4F6',
        }}
        aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center rounded-lg w-7 h-7 transition-colors"
            style={{
              background: isDarkMode ? 'rgba(163, 230, 53, 0.15)' : 'rgba(100, 116, 139, 0.15)',
              color: isDarkMode ? '#A3E635' : '#64748B',
            }}
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
          </div>
          <div className="text-left">
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>
              {isDarkMode ? 'Black + Neon Dark' : 'Light Grey Theme'}
            </div>
            <div style={{ fontSize: 10, color: '#64748B' }}>
              {isDarkMode ? 'Sports Palette (#0A0A0A)' : 'Daylight Canvas (#F3F4F6)'}
            </div>
          </div>
        </div>

        {/* Switch Pill */}
        <div
          className="relative flex items-center p-0.5 rounded-full transition-colors duration-200"
          style={{
            width: 38,
            height: 22,
            background: isDarkMode ? '#A3E635' : 'rgba(255, 255, 255, 0.18)',
            boxShadow: isDarkMode ? '0 0 10px rgba(163, 230, 53, 0.4)' : 'none',
          }}
        >
          <motion.div
            className="rounded-full shadow-xs"
            style={{ width: 18, height: 18, background: isDarkMode ? '#0A0A0A' : '#FFFFFF' }}
            animate={{ x: isDarkMode ? 16 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </div>
      </button>
    );
  }

  // Floating button variant
  return (
    <button
      type="button"
      id="theme-toggle-floating"
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`fixed z-40 flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg ${className}`}
      style={{
        top: 'max(12px, env(safe-area-inset-top))',
        right: '12px',
        background: isDarkMode ? 'rgba(10, 10, 10, 0.88)' : 'rgba(243, 244, 246, 0.90)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: isDarkMode ? '1.5px solid rgba(163, 230, 53, 0.35)' : '1px solid rgba(100, 116, 139, 0.25)',
        boxShadow: isDarkMode
          ? '0 4px 16px rgba(0, 0, 0, 0.7), 0 0 14px rgba(163, 230, 53, 0.25)'
          : '0 4px 16px rgba(15, 23, 42, 0.08), 0 0 12px rgba(100, 116, 139, 0.12)',
      }}
    >
      <motion.div
        key={isDarkMode ? 'dark' : 'light'}
        initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
      >
        {isDarkMode ? (
          <Sun size={19} className="text-[#A3E635] drop-shadow-[0_0_8px_rgba(163,230,53,0.6)]" />
        ) : (
          <Moon size={18} className="text-[#64748B] fill-slate-700/10 drop-shadow" />
        )}
      </motion.div>
    </button>
  );
}
