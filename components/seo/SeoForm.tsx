import React from "react";
import { translations } from "../ai/shared/translations";

export interface SeoFormData {
  pageType: string;
  audience: string;
  title: string;
  description: string;
  language: string;
  tone: string;
}

interface SeoFormProps {
  formData: SeoFormData;
  setFormData: (data: SeoFormData) => void;
  onSubmit: () => void;
  isLoading: boolean;
  lang: "en" | "ar";
}

export default function SeoForm({ formData, setFormData, onSubmit, isLoading, lang }: SeoFormProps) {
  const t = translations[lang];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const descLength = formData.description.length;
  const getDescColor = () => {
    if (descLength >= 150 && descLength <= 160) return "text-success";
    if (descLength >= 120 && descLength <= 170) return "text-warning";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Page Type */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.page_type}</label>
          <select
            name="pageType"
            value={formData.pageType}
            onChange={handleChange}
            className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none transition-all"
          >
            <option value="Project Page">Project Page</option>
            <option value="Home Page">Home Page</option>
            <option value="About Page">About Page</option>
            <option value="Skills Page">Skills Page</option>
            <option value="Certificate Page">Certificate Page</option>
            <option value="Contact Page">Contact Page</option>
          </select>
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.target_audience}</label>
          <select
            name="audience"
            value={formData.audience}
            onChange={handleChange}
            className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none transition-all"
          >
            <option value="Recruiters / HR">Recruiters / HR</option>
            <option value="Clients / Businesses">Clients / Businesses</option>
            <option value="Developers">Developers</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* Page Title */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.title_label}</label>
        <input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          placeholder={lang === 'en' ? "e.g. Portfolio v2 - Artisan Admin Dashboard" : "مثال: محفظتي الشخصية - لوحة تحكم أرتيزان"}
          className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none transition-all"
        />
      </div>

      {/* Description / Tech Stack */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.desc_label}</label>
          <span className={`text-[10px] font-mono font-bold ${getDescColor()}`}>
            {descLength} chars
          </span>
        </div>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder={lang === 'en' ? "Provide some context..." : "أدخل بعض السياق حول الصفحة..."}
          className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none transition-all resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.language}</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none transition-all"
          >
            <option value="English">English</option>
            <option value="Arabic">Arabic</option>
            <option value="Both">Both</option>
          </select>
        </div>

        {/* Tone */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.tone}</label>
          <select
            name="tone"
            value={formData.tone}
            onChange={handleChange}
            className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none transition-all"
          >
            <option value="Professional">Professional</option>
            <option value="Technical">Technical</option>
            <option value="Creative / Artisan">Creative / Artisan</option>
          </select>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isLoading || !formData.title}
        className={`w-full py-4 font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
          isLoading || !formData.title
            ? "bg-foreground/10 text-muted-foreground cursor-not-allowed"
            : "bg-success text-black hover:brightness-110 active:scale-[0.98]"
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            {t.generating}
          </>
        ) : (
          t.generate_btn
        )}
      </button>
    </div>
  );
}
