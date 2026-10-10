import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';
import { Shield, CheckCircle2, Lock, UserCheck, ArrowRight, Award, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ROLE_HOME } from '../ProtectedRoute';
import { useHaptics } from '../../hooks/useHaptics';
import { supabase } from '../../lib/supabase';

// Removed ROLES since role is inferred from Supabase profiles

export default function AuthScreen() {
  const { navigateTo, setUserEmail, setUserRole, setIsAuthenticated } = useCricket();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState({ text: '', type: '' });

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setIsResetting(true);
    setResetMessage({ text: '', type: '' });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/`,
      });

      if (error) throw error;

      setResetMessage({
        text: 'A password reset link has been sent to your email address.',
        type: 'success'
      });
    } catch (err) {
      setResetMessage({
        text: err.message || 'Failed to send reset link. Please check the email.',
        type: 'error'
      });
    } finally {
      setIsResetting(false);
    }
  };

  const haptics = useHaptics();

  const handleLogin = async (e) => {
    e.preventDefault();
    haptics.light();
    
    if (!emailInput || !passwordInput) {
      haptics.error();
      setErrorMsg('Please enter both email and password.');
      return;
    }
    
    setErrorMsg('');
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput,
      password: passwordInput,
    });

    if (error) {
      setIsLoading(false);
      haptics.error();
      setErrorMsg(error.message);
      return;
    }

    // On success, CricketContext's onAuthStateChange handles navigation via App.jsx RootRedirect
    haptics.success();
    // No need to setIsLoading(false) because component unmounts upon redirect
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#F3F4F6] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F3F4F6]">
      
      {/* Left Panel: Hero Image (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop" 
            alt="Cricket Stadium" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#14171A]/90 to-[#0A0A0A]/50 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[#A3E635]/10" />
        </div>

        {/* Top Header Logo */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 flex items-center gap-3"
        >
          <img src="/jdca-logo.png" alt="JDCA" className="w-12 h-12 object-contain drop-shadow-md" />
          <span className="text-white font-black text-xl tracking-wide">JDCA</span>
        </motion.div>

        {/* Bottom Hero Text */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-[#A3E635]/30 text-[#A3E635] text-xs font-bold uppercase tracking-wider mb-4">
            <Award size={14} className="text-[#A3E635]" />
            Official Management Portal
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Empowering <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A3E635] to-emerald-400">
              Grassroots Cricket
            </span>
          </h1>
          <p className="text-slate-300 text-sm max-w-md leading-relaxed font-medium">
            Jabalpur Division Cricket Association's unified platform for tournament management, live scoring, and player registration.
          </p>
        </motion.div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 relative bg-[#F3F4F6] dark:bg-[#0A0A0A]">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden flex flex-col items-center justify-center mb-10 mt-8">
          <img src="/jdca-logo.png" alt="JDCA" className="w-20 h-20 object-contain drop-shadow-sm mb-3" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">JDCA Portal</h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="mb-8">
            <h2 className="font-black text-slate-900 dark:text-white mb-2" style={{ fontSize: 26, letterSpacing: '-0.025em' }}>Welcome back</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Enter your official credentials to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {errorMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl text-xs font-bold flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-500">
                <Shield size={15} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="admin@jdca.mp.in"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-[#262B30] border border-slate-200 dark:border-white/10 outline-none transition-all placeholder:text-slate-400 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/20"
                />
                <UserCheck size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#A3E635] transition-colors" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(emailInput);
                    setResetMessage({ text: '', type: '' });
                    setShowForgotModal(true);
                  }}
                  className="text-xs font-bold cursor-pointer text-[#A3E635] hover:underline bg-transparent border-0"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-[#262B30] border border-slate-200 dark:border-white/10 outline-none transition-all placeholder:text-slate-400 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/20"
                />
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#A3E635] transition-colors" />
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#A3E635] hover:bg-[#8cd122] text-[#0A0A0A] font-extrabold rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 mt-2 cursor-pointer shadow-lg shadow-[#A3E635]/25 border-none min-h-[48px]"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin text-[#0A0A0A]" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 pt-5 text-center border-t border-slate-200 dark:border-white/10">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              JDCA Official Portal
            </p>
          </div>

        </motion.div>
      </div>

      {/* ── FORGOT PASSWORD MODAL ── */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#262B30] rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-100 dark:border-white/10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10 mb-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Reset Password</h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Enter your registered official email address. We will send you a secure link to reset your account password.
            </p>

            {resetMessage.text && (
              <div className={`p-3 rounded-xl text-xs font-bold mb-4 ${
                resetMessage.type === 'success'
                  ? 'bg-[#A3E635]/15 text-[#65a30d] dark:text-[#A3E635] border border-[#A3E635]/30'
                  : 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
              }`}>
                {resetMessage.text}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@jdca.org"
                  className="w-full bg-slate-50 dark:bg-[#1E2226] border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="px-4 py-2 bg-[#A3E635] hover:bg-[#8cd122] text-[#0A0A0A] rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isResetting && <Loader2 size={12} className="animate-spin text-[#0A0A0A]" />}
                  <span>{isResetting ? 'Sending...' : 'Send Reset Link'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
