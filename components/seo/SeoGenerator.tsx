"use client";

import React, { useState, useEffect } from "react";
import SeoForm, { SeoFormData } from "./SeoForm";
import SeoOutput from "./SeoOutput";
import { Sparkles, RefreshCw, History } from "lucide-react";
import { translations } from "../ai/shared/translations";
import LanguageToggle from "../ai/shared/LanguageToggle";

const initialFormData: SeoFormData = {
  pageType: "Project Page",
  audience: "Recruiters / HR",
  title: "",
  description: "",
  language: "English",
  tone: "Professional",
};

export default function SeoGenerator() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [formData, setFormData] = useState<SeoFormData>(initialFormData);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = translations[lang];

  // Load from localStorage
  useEffect(() => {
    const savedResult = localStorage.getItem("last_seo_result");
    const savedLang = localStorage.getItem("artisan_lang") as "en" | "ar";
    if (savedResult) {
      try {
        setResult(JSON.parse(savedResult));
      } catch (e) {
        console.error("Failed to parse saved SEO result");
      }
    }
    if (savedLang) setLang(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem("artisan_lang", lang);
  }, [lang]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, language: lang === 'en' ? 'English' : 'Arabic' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate SEO");
      }

      setResult(data);
      localStorage.setItem("last_seo_result", JSON.stringify(data));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    localStorage.removeItem("last_seo_result");
  };

  return (
    <div className={`space-y-8 animate-in fade-in duration-700 ${lang === 'ar' ? 'font-arabic' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-success/10 text-success border border-success/20">
                <Sparkles size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                {t.seo_title} <span className="text-success">{t.seo_subtitle}</span>
              </h2>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
              {t.powered_by}
            </p>
          </div>
          <LanguageToggle lang={lang} setLang={setLang} />
        </div>
        
        {result && (
          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-success/10 hover:text-success transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              {t.regenerate}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all"
            >
              {t.clear}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-card/50 backdrop-blur-sm border border-border p-8 relative overflow-hidden">
            <div className={`absolute top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-1 h-full bg-success/50`} />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground mb-8 flex items-center gap-3">
              <History size={14} className="text-success" />
              {t.configure_details}
            </h3>
            <SeoForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleGenerate} 
              isLoading={isLoading}
              lang={lang}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest animate-in slide-in-from-top-2">
              {t.error}: {error}
            </div>
          )}
        </div>

        {/* Right Column: Output */}
        <div className="xl:col-span-7">
          {result ? (
            <div className="bg-card/50 backdrop-blur-sm border border-border p-8 relative min-h-[600px]">
              <div className={`absolute top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-1 h-full bg-success/50`} />
              <SeoOutput data={result} lang={lang} />
            </div>
          ) : (
            <div className="h-full min-h-[600px] border border-dashed border-border flex flex-col items-center justify-center text-center p-12 bg-foreground/[0.01]">
              <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
                <Sparkles size={40} className="text-muted-foreground/30" />
              </div>
              <h4 className="text-sm font-bold text-foreground uppercase tracking-widest mb-2">{t.ready_to_generate}</h4>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                {t.ready_desc}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
