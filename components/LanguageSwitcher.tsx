"use client";

import { useLanguage } from "@/context/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "es" : "en")}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors text-sm font-medium"
      aria-label="Switch language"
    >
      <span className={language === "en" ? "font-bold" : "opacity-70"}>EN</span>
      <span className="text-accent/50">|</span>
      <span className={language === "es" ? "font-bold" : "opacity-70"}>ES</span>
    </button>
  );
}
