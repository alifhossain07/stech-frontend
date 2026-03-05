"use client";

import React from "react";
import enMessages from "@/app/i18n/messages/en.json";
import bnMessages from "@/app/i18n/messages/bn.json";

export type Locale = "en" | "bn";

type Messages = Record<string, unknown>;

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const STORAGE_KEY = "sannai_locale";

const MESSAGES: Record<Locale, Messages> = {
  en: enMessages,
  bn: bnMessages,
};

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

function resolveMessage(messages: Messages, key: string): string | null {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return null;
  }, messages);

  return typeof value === "string" ? value : null;
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, token: string) => {
    const value = params[token];
    return value !== undefined ? String(value) : "";
  });
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("en");

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "bn") {
        setLocaleState(stored);
        document.documentElement.lang = stored;
      }
    } catch {
      // ignore storage access errors
    }
  }, []);

  const setLocale = React.useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    try {
      localStorage.setItem(STORAGE_KEY, nextLocale);
    } catch {
      // ignore storage access errors
    }
    document.documentElement.lang = nextLocale;
  }, []);

  const t = React.useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const current = resolveMessage(MESSAGES[locale], key);
      const fallback = resolveMessage(MESSAGES.en, key);
      const template = current ?? fallback ?? key;
      return interpolate(template, params);
    },
    [locale]
  );

  const value = React.useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
