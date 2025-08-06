import { useState, useEffect } from "react";
import { User } from "@shared/schema";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

// Simple auth state management - in production, use proper state management
let authState: { user: User | null } = { user: null };
let listeners: Set<() => void> = new Set();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const useAuth = (): AuthState => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const login = (user: User) => {
    authState.user = user;
    localStorage.setItem('auth-user', JSON.stringify(user));
    notifyListeners();
  };

  const logout = async () => {
    try {
      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state regardless of API call result
      authState.user = null;
      localStorage.removeItem('auth-user');
      notifyListeners();
    }
  };

  // Initialize from localStorage on first render
  useEffect(() => {
    const savedUser = localStorage.getItem('auth-user');
    if (savedUser && !authState.user) {
      try {
        authState.user = JSON.parse(savedUser);
        forceUpdate({});
      } catch (error) {
        localStorage.removeItem('auth-user');
      }
    }
  }, []);

  return {
    user: authState.user,
    isAuthenticated: !!authState.user,
    login,
    logout,
  };
};