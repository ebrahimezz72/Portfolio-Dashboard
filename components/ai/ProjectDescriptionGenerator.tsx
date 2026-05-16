"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Briefcase, Tag, FileText, CheckCircle2 } from "lucide-react";
import { translations } from "./shared/translations";
import LanguageToggle from "./shared/LanguageToggle";
import CopyButton from "./shared/CopyButton";

interface ProjectFormData {
  projectName: string;
  techStack: string;
  projectType: string;
  audience: string;
  notes: string;
  style: string;
}

const initialFormData: ProjectFormData = {
  projectName: "",
  techStack: "",
  projectType: "Full Stack",
  audience: "Clients",
  notes: "",
  style: "Technical",
};

export default function ProjectDescriptionGenerator() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = translations[lang];

  useEffect(() => {
    const savedLang = localStorage.getItem("artisan_lang") as "en" | "ar";
    if (savedLang) setLang(savedLang);
    const savedResult = localStorage.getItem("last_project_result");
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
      const response = await fetch("/api/ai/project-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, language: lang === 'en' ? 'English' : 'Arabic' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate");

      setResult(data);
      localStorage.setItem("last_project_result", JSON.stringify(data));
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
                <Briefcase size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                {t.project_title} <span className="text-success">{t.project_subtitle}</span>
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
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.project_name}</label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="e.g. DeQaa Law Firm"
                  className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.tech_stack}</label>
                <input
                  type="text"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleChange}
                  placeholder="React, Next.js, Supabase..."
                  className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.project_type}</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.style}</label>
                  <select
                    name="style"
                    value={formData.style}
                    onChange={handleChange}
                    className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Storytelling">Storytelling</option>
                    <option value="Concise">Concise</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.short_notes}</label>
                <textarea
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none resize-none"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading || !formData.projectName}
                className={`w-full py-4 font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                  isLoading || !formData.projectName
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
              {/* Short & Full Description */}
              <div className="bg-card border border-border p-8 relative">
                <div className={`absolute top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-1 h-full bg-success/50`} />
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-success">{t.short_desc}</h4>
                      <CopyButton text={result.short_description} />
                    </div>
                    <p className="text-sm text-foreground bg-foreground/5 p-4 border border-border/50 italic">
                      "{result.short_description}"
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-success">{t.full_desc}</h4>
                      <CopyButton text={result.full_description} />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {result.full_description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlights & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border p-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-success" /> {t.highlights}
                  </h4>
                  <ul className="space-y-3">
                    {result.highlight_points.map((point: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2 group">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-success shrink-0" />
                        <span className="flex-1">{point}</span>
                        <CopyButton text={point} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card border border-border p-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <Tag size={14} className="text-success" /> {t.suggested_tags}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.suggested_tags.map((tag: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-success/5 border border-success/10 text-[10px] font-bold text-success uppercase tracking-widest">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Case Study */}
              <div className="bg-card border border-border p-6">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <FileText size={14} className="text-success" /> {t.case_study}
                </h4>
                <div className="bg-foreground/[0.02] border border-border p-4">
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {result.case_study_intro}
                  </p>
                  <CopyButton text={result.case_study_intro} label={t.copy} className="text-success" />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border border-dashed border-border flex flex-col items-center justify-center text-center p-12">
              <Sparkles size={40} className="text-muted-foreground/20 mb-4" />
              <h4 className="text-sm font-bold text-foreground uppercase tracking-widest mb-2">{t.ready_to_generate}</h4>
              <p className="text-xs text-muted-foreground max-w-xs">{t.ready_desc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
