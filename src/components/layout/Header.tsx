import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, LogOut, Globe } from 'lucide-react';

export default function Header() {
  const { t, toggleLang, isRTL } = useLanguage();
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/admin/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-start group"
          >
            <span className="text-xl sm:text-2xl font-bold tracking-widest text-gold font-playfair leading-none">
              MEDO
            </span>
            <span className="text-xs tracking-[0.3em] text-white/60 font-cairo">
              STORE
            </span>
          </button>

          {/* Right Actions */}
          <div className={`flex items-center gap-2 sm:gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-btn text-white/80 hover:text-white text-xs sm:text-sm font-cairo transition-all duration-300"
            >
              <Globe size={14} />
              <span>{t.switchLang}</span>
            </button>

            {/* Admin / Dashboard */}
            {isAdmin ? (
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <button
                  onClick={handleAdminClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-btn-gold text-gold hover:text-white text-xs sm:text-sm font-cairo transition-all duration-300"
                >
                  <Settings size={14} />
                  <span className="hidden sm:inline">{t.adminDashboard}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-btn text-white/60 hover:text-red-400 text-xs sm:text-sm font-cairo transition-all duration-300"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdminClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-btn text-white/60 hover:text-white text-xs sm:text-sm font-cairo transition-all duration-300"
              >
                <Settings size={14} />
                <span className="hidden sm:inline">{t.adminLogin}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
