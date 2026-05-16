"use client";

import React from "react";

interface LanguageToggleProps {
  lang: "en" | "ar";
  setLang: (lang: "en" | "ar") => void;
}

export default function LanguageToggle({ lang, setLang }: LanguageToggleProps) {
  return (
    <div className="flex bg-foreground/5 p-1 border border-border">
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all ${
          lang === "en" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("ar")}
        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all ${
          lang === "ar" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        AR
      </button>
    </div>
  );
}
