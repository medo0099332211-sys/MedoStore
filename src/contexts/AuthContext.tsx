import React, { createContext, useContext, useState } from 'react';
import { getAdminPassword, saveAdminPassword } from '@/lib/storage';

interface AuthContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  login: () => false,
  logout: () => {},
  changePassword: () => ({ success: false }),
});

const ADMIN_USER = 'admin';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('medo_admin') === 'true';
  });

  const login = (username: string, password: string): boolean => {
    const currentPass = getAdminPassword();
    if (username === ADMIN_USER && password === currentPass) {
      setIsAdmin(true);
      sessionStorage.setItem('medo_admin', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('medo_admin');
  };

  const changePassword = (currentPassword: string, newPassword: string): { success: boolean; error?: string } => {
    const stored = getAdminPassword();
    if (currentPassword !== stored) {
      return { success: false, error: 'current_wrong' };
    }
    if (newPassword.length < 4) {
      return { success: false, error: 'too_short' };
    }
    saveAdminPassword(newPassword);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
