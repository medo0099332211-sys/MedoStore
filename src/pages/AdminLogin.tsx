import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, User, LogIn, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const { t, isRTL } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        navigate('/admin');
      } else {
        setError(t.invalidCredentials);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div className="absolute inset-0 bg-dark">
        <div className="absolute top-1/3 start-1/4 w-64 h-64 rounded-full bg-gold/10 blur-[80px]" />
        <div className="absolute bottom-1/3 end-1/4 w-48 h-48 rounded-full bg-gold/5 blur-[60px]" />
      </div>

      <div className="relative glass-modal w-full max-w-sm rounded-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gold font-playfair tracking-widest">MEDO</h1>
          <p className="text-white/40 font-cairo text-xs tracking-widest mt-1">STORE · ADMIN</p>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 mb-6">
          <Lock size={18} className="text-gold" />
          <h2 className="text-white font-cairo font-semibold text-lg">{t.adminDashboard}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-white/60 text-xs font-cairo mb-1.5">{t.adminUsername}</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full glass-input font-cairo text-sm ps-9"
                dir="ltr"
                autoComplete="username"
              />
              <User size={14} className="absolute top-1/2 -translate-y-1/2 start-3 text-white/30" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-white/60 text-xs font-cairo mb-1.5">{t.adminPassword}</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input font-cairo text-sm ps-9 pe-9"
                dir="ltr"
                autoComplete="current-password"
              />
              <Lock size={14} className="absolute top-1/2 -translate-y-1/2 start-3 text-white/30" />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute top-1/2 -translate-y-1/2 end-3 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm font-cairo text-center bg-red-400/10 rounded-lg py-2 px-3">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gold text-dark font-cairo font-bold text-sm hover:bg-gold-light transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-dark/40 border-t-dark rounded-full animate-spin" />
            ) : (
              <LogIn size={16} />
            )}
            {t.loginBtn}
          </button>
        </form>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 text-center text-white/30 hover:text-white/60 font-cairo text-xs transition-colors"
        >
          ← {isRTL ? 'العودة للمتجر' : 'Back to Store'}
        </button>
      </div>
    </div>
  );
}
