import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/cafe';

interface AuthContextType {
  user: User | null;
  adminUser: User | null;
  adminToken: string | null;
  isLoading: boolean;
  loginCustomer: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerCustomer: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logoutCustomer: () => void;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_TOKEN_KEY = 'sip_joy_customer_token';
const ADMIN_TOKEN_KEY = 'sip_joy_admin_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  // Check stored sessions
  useEffect(() => {
    const initAuth = async () => {
      const custToken = localStorage.getItem(USER_TOKEN_KEY);
      if (custToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: custToken }
          });
          const data = await res.json();
          if (res.ok && data.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem(USER_TOKEN_KEY);
          }
        } catch {
          // ignore network failure on boot
        }
      }

      const admToken = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (admToken) {
        try {
          // Verify admin
          const res = await fetch('/api/admin/stats', {
            headers: { Authorization: admToken, 'x-admin-token': admToken }
          });
          if (res.ok) {
            setAdminUser({
              id: 'usr-admin-1',
              name: 'Café Administrator',
              email: 'admin@sipandjoycafe.com',
              role: 'admin',
              createdAt: new Date().toISOString()
            });
          } else {
            localStorage.removeItem(ADMIN_TOKEN_KEY);
            setAdminToken(null);
          }
        } catch {
          // ignore
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const loginCustomer = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        localStorage.setItem(USER_TOKEN_KEY, data.token);
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed.' };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const registerCustomer = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        localStorage.setItem(USER_TOKEN_KEY, data.token);
        return { success: true };
      }
      return { success: false, error: data.error || 'Registration failed.' };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logoutCustomer = () => {
    setUser(null);
    localStorage.removeItem(USER_TOKEN_KEY);
  };

  const loginAdmin = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminUser(data.user);
        setAdminToken(data.token);
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid administrator credentials.' };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    setAdminToken(null);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        adminToken,
        isLoading,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        loginAdmin,
        logoutAdmin,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
