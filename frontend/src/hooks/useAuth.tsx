/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – useAuth hook
   Auth state management, login/logout, session handling.
   The backend is the authority on permissions.
   ────────────────────────────────────────────────────────────────── */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { api, ApiError } from '@/services/apiClient';
import type { User, AuthSession } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'mahagrid_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    if (typeof window === 'undefined') {
      return { user: null, isAuthenticated: false, isLoading: false, error: null };
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored) as User;
        if (parsedUser && parsedUser.id) {
          return { user: parsedUser, isAuthenticated: true, isLoading: false, error: null };
        }
      } catch {
        // Fallback
      }
    }
    return { user: null, isAuthenticated: false, isLoading: false, error: null };
  });

  const checkSession = useCallback(async () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
      return;
    }

    // Immediately hydrate from local storage for seamless demo operation
    try {
      const parsedUser = JSON.parse(stored) as User;
      if (parsedUser && parsedUser.id) {
        setState({
          user: parsedUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
      return;
    }

    // Attempt backend session verification if online
    try {
      const session = await api.get<{ data: User }>('/auth/me');
      setState({
        user: session.data,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      // Only clear session if backend explicitly rejected with 401 Unauthorized
      if (err instanceof ApiError && err.status === 401) {
        localStorage.removeItem(STORAGE_KEY);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
      // If network error / backend offline, keep demo session intact
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await api.post<AuthSession>('/auth/login', { email, password });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response.user));
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Login failed. Please try again.';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Best-effort logout
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      checkSession();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [checkSession]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
