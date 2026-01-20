"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "./authApi";
import { fetchProfile, login as apiLogin, signup as apiSignup } from "./authApi";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (args: { login_by: "phone"; phone: string; password: string }, forcedType?: string) => Promise<void>;
  signup: (args: {
    name: string;
    register_by: "phone";
    email_or_phone: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "sannai_auth_token";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const forcedType = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY + "_forced_type") : null;

    if (!stored) {
      setLoading(false);
      return;
    }

    const token = stored;
    setAccessToken(token);

    fetchProfile(token)
      .then((res) => {
        if (res.result) {
          const userWithForcedType = {
            ...res.user,
            type: forcedType || res.user.type
          };
          setUser(userWithForcedType);
        } else {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STORAGE_KEY + "_forced_type");
          setAccessToken(null);
        }
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY + "_forced_type");
        setAccessToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async (args: {
    login_by: "phone";
    phone: string;
    password: string;
  }, forcedType?: string) => {
    setLoading(true);
    try {
      const res = await apiLogin(args);
      if (!res.result) throw new Error(res.message || "Login failed");

      // Check if this is a dealer account
      const isDealerAccount = res.user.is_dealer == 1 || !!res.user.dealer_code;

      if (forcedType === "dealer") {
        if (!isDealerAccount) {
          throw new Error("This account is not registered as a dealer. Please login as a regular user.");
        }
      } else {
        // Regular login path
        if (isDealerAccount) {
          throw new Error("Dealer accounts must login through the Dealer Portal.");
        }
      }

      const userWithForcedType = {
        ...res.user,
        type: forcedType || res.user.type
      };

      setAccessToken(res.access_token);
      setUser(userWithForcedType);
      localStorage.setItem(STORAGE_KEY, res.access_token);

      // Also store forced type in local storage if needed for rehydration?
      // Actually, fetchProfile should handle it, but if fetchProfile returns "customer"
      // we might need to store the forced type.
      if (forcedType) {
        localStorage.setItem(STORAGE_KEY + "_forced_type", forcedType);
      } else {
        localStorage.removeItem(STORAGE_KEY + "_forced_type");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (args: {
    name: string;
    register_by: "phone";
    email_or_phone: string;
    password: string;
    password_confirmation: string;
  }) => {
    setLoading(true);
    try {
      const res = await apiSignup(args);
      if (!res.result) throw new Error(res.message || "Signup failed");
      setAccessToken(res.access_token);
      setUser(res.user);
      localStorage.setItem(STORAGE_KEY, res.access_token);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY + "_forced_type");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login: handleLogin,
        signup: handleSignup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};