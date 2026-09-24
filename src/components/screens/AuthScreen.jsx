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
    <div className="min-h-screen flex relative overflow-hidden bg-white">
      
      {/* Left Panel: Hero Image (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop" 
            alt="Cricket Stadium" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-blue-900/80 to-slate-900/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-blue-600/20" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-100 text-xs font-bold uppercase tracking-wider mb-4">
            <Award size={14} className="text-blue-300" />
            Official Management Portal
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Empowering <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300">
              Grassroots Cricket
            </span>
          </h1>
          <p className="text-blue-100 text-sm max-w-md leading-relaxed font-medium">
            Jabalpur District Cricket Association's unified platform for tournament management, live scoring, and player registration.
          </p>
        </motion.div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 bg-slate-50 relative">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden flex flex-col items-center justify-center mb-10 mt-8">
          <img src="/jdca-logo.png" alt="JDCA" className="w-20 h-20 object-contain drop-shadow-sm mb-3" />
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">JDCA Portal</h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Welcome back</h2>
            <p className="text-sm text-slate-500 font-medium">Please enter your official credentials to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {errorMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold flex items-start gap-2">
                <Shield size={16} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider pl-1">Official Email / ID</label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="admin@jdca.mp.in"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all placeholder:text-slate-400 shadow-sm"
                />
                <UserCheck size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between pl-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 pl-11 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all placeholder:text-slate-400 shadow-sm"
                />
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Secure Login</span>
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-slate-200 text-center">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              JDCA Version 2.4
            </p>
          </div>

        </motion.div>
      </div>

    </div>
  );
}
