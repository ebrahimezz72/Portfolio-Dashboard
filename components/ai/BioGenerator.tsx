"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw, UserCircle, Target, Lightbulb, Quote } from "lucide-react";
import { translations } from "./shared/translations";
import LanguageToggle from "./shared/LanguageToggle";
import CopyButton from "./shared/CopyButton";

interface BioFormData {
  documentType: string;
  tone: string;
  yearsExp: string;
  skills: string;
  achievement: string;
  targetRole: string;
  context: string;
}

const initialFormData: BioFormData = {
  documentType: "Portfolio About",
  tone: "Professional",
  yearsExp: "1",
  skills: "React, Next.js, TypeScript, Tailwind CSS, Supabase",
  achievement: "Launched DeQaa Law Firm website",
  targetRole: "Senior Frontend Developer",
  context: "",
};

export default function BioGenerator() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [formData, setFormData] = useState<BioFormData>(initialFormData);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = translations[lang];

  useEffect(() => {
    const savedLang = localStorage.getItem("artisan_lang") as "en" | "ar";
    if (savedLang) setLang(savedLang);
    const savedResult = localStorage.getItem("last_bio_result");
    if (savedResult) {
      try {
        setResult(JSON.parse(savedResult));
      } catch (e) {}
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, language: lang === 'en' ? 'English' : 'Arabic' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate");

      setResult(data);
      localStorage.setItem("last_bio_result", JSON.stringify(data));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-8 animate-in fade-in duration-700 ${lang === 'ar' ? 'font-arabic' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-success/10 text-success border border-success/20">
                <UserCircle size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                {t.bio_title} <span className="text-success">{t.bio_subtitle}</span>
              </h2>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
              {t.powered_by}
            </p>
          </div>
          <LanguageToggle lang={lang} setLang={setLang} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Form */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-card/50 backdrop-blur-sm border border-border p-8 relative overflow-hidden">
            <div className={`absolute top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-1 h-full bg-success/50`} />
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.doc_type}</label>
                  <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleChange}
                    className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none"
                  >
                    <option value="Portfolio About">Portfolio About</option>
                    <option value="LinkedIn Summary">LinkedIn Summary</option>
                    <option value="CV Bio">CV Bio</option>
                    <option value="Twitter/X Bio">Twitter/X Bio</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.tone}</label>
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleChange}
                    className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Creative/Artisan">Creative/Artisan</option>
                    <option value="Concise">Concise</option>
                    <option value="Story-driven">Story-driven</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.exp_years}</label>
                  <input
                    type="number"
                    name="yearsExp"
                    value={formData.yearsExp}
                    onChange={handleChange}
                    className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.target_role}</label>
                  <input
                    type="text"
                    name="targetRole"
                    value={formData.targetRole}
                    onChange={handleChange}
                    className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.top_skills}</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.achievement}</label>
                <input
                  type="text"
                  name="achievement"
                  value={formData.achievement}
                  onChange={handleChange}
                  className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.extra_context}</label>
                <textarea
                  name="context"
                  rows={3}
                  value={formData.context}
                  onChange={handleChange}
                  className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none resize-none"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`w-full py-4 font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                  isLoading
                    ? "bg-foreground/10 text-muted-foreground"
                    : "bg-success text-black hover:brightness-110 active:scale-95"
                }`}
              >
                {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {isLoading ? t.generating : t.generate_btn}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="xl:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              {/* Bio Result */}
              <div className="bg-card border border-border p-8 relative">
                <div className={`absolute top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-1 h-full bg-success/50`} />
                
                <div className="space-y-8">
                  {/* Headline & Tagline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-foreground/[0.03] p-4 border border-border">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-[9px] font-bold uppercase tracking-widest text-success">{t.headline}</h4>
                        <CopyButton text={result.headline} />
                      </div>
                      <p className="text-sm font-bold text-foreground">{result.headline}</p>
                    </div>
                    <div className="bg-foreground/[0.03] p-4 border border-border">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-[9px] font-bold uppercase tracking-widest text-success">{t.tagline}</h4>
                        <CopyButton text={result.tagline} />
                      </div>
                      <p className="text-sm italic text-muted-foreground">"{result.tagline}"</p>
                    </div>
                  </div>

                  {/* Main Bio */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Quote size={14} className="text-success" /> {t.generated_bio}
                      </h4>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono text-muted-foreground">{result.char_count} chars</span>
                        <CopyButton text={result.bio} label={t.copy} className="text-success" />
                      </div>
                    </div>
                    <div className="bg-foreground/[0.01] p-6 border border-border/50 leading-relaxed text-foreground whitespace-pre-wrap text-sm">
                      {result.bio}
                    </div>
                  </div>

                  {/* Tips */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                      <Lightbulb size={14} className="text-success" /> {t.tips}
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {result.improvement_tips.map((tip: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-success/5 border border-success/10 text-xs text-muted-foreground">
                          <span className="w-1.5 h-1.5 bg-success shrink-0" />
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border border-dashed border-border flex flex-col items-center justify-center text-center p-12">
              <Target size={40} className="text-muted-foreground/20 mb-4" />
              <h4 className="text-sm font-bold text-foreground uppercase tracking-widest mb-2">{t.ready_to_generate}</h4>
              <p className="text-xs text-muted-foreground max-w-xs">{t.ready_desc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
