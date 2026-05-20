import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { ShieldCheck, Mail, Lock, Loader2, Sparkles, X } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface AuthProps {
  onAuthSuccess?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const checkSupabaseConfig = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
      showToast("Supabase is not configured correctly. Check your environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).", "error");
      return false;
    }
    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkSupabaseConfig()) return;

    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        showToast("Verification mail sent. Check your email.", "success");
        onAuthSuccess?.();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showToast("Logged in successfully. Welcome back!", "success");
        onAuthSuccess?.();
      }
    } catch (error: any) {
      showToast(error.message || "Authentication failed. Check your Supabase project settings.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSSO = async (provider: 'google' | 'azure') => {
    if (!checkSupabaseConfig()) return;

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error: any) {
      showToast(error.message || `SSO Login failed. Ensure ${provider} provider is enabled in Supabase.`, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-legal-900 p-8 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-legal-gold/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-md w-full bg-white rounded-[48px] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.4)] p-12 overflow-hidden relative z-10 border border-slate-100 italic animate-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-legal-900 rounded-[20px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-legal-900/20">
            <ShieldCheck className="text-legal-gold" size={32} />
          </div>
          <h2 className="text-4xl font-serif font-black text-legal-900 italic tracking-tighter">LexiNaija</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">
            {isSignUp ? 'Create New Account' : 'Login to your account'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-legal-gold transition-colors" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-legal-900 focus:bg-white focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all placeholder-slate-300"
                placeholder="yourname@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Password</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-legal-gold transition-colors" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-legal-900 focus:bg-white focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all placeholder-slate-300"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-legal-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-legal-900/20 hover:bg-legal-gold hover:text-legal-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={18} className="group-hover:scale-110 transition-transform" />}
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Login'}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-100"></div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Normal SSO</span>
          <div className="h-px flex-1 bg-slate-100"></div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => handleSSO('google')}
            className="flex items-center justify-center gap-3 py-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white transition-all text-[10px] font-black uppercase tracking-widest text-slate-600 w-full"
          >
            Launch with SSO
          </button>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[10px] font-black text-slate-400 hover:text-legal-gold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            {isSignUp ? (
              <>Have an account? <span className="text-legal-900">Login</span></>
            ) : (
              <>New to LexiNaija? <span className="text-legal-900">Register now</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
