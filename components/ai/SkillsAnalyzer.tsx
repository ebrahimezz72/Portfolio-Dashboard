"use client";

import React, { useState } from "react";
import { Sparkles, Target, BookOpen, Award, TrendingUp, RefreshCw, ChevronRight } from "lucide-react";
import { translations } from "./shared/translations";
import LanguageToggle from "./shared/LanguageToggle";

export default function SkillsAnalyzer() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [targetRole, setTargetRole] = useState("Senior Full Stack Engineer");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[lang];

  const currentSkills = "React, Next.js, TypeScript, Tailwind, Supabase, Node.js, Python, PostgreSQL";

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/skills-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentSkills,
          targetRole,
          language: lang === 'en' ? 'English' : 'Arabic'
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Skills analysis failed", err);
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
              <div className="p-2 bg-accent/10 text-accent border border-accent/20">
                <TrendingUp size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                Skills Gap <span className="text-accent">Analyzer</span>
              </h2>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
              AI Career Growth Roadmap
            </p>
          </div>
          <LanguageToggle lang={lang} setLang={setLang} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Input Card */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-card/50 backdrop-blur-sm border border-border p-8 relative overflow-hidden">
            <div className={`absolute top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-1 h-full bg-accent/50`} />
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Target Career Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-foreground/5 border border-border px-4 py-3 text-sm focus:border-accent outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current Skillset (Auto-detected)</label>
                <div className="flex flex-wrap gap-2 p-4 bg-foreground/[0.02] border border-border">
                  {currentSkills.split(',').map(s => (
                    <span key={s} className="px-2 py-1 bg-foreground/5 text-[10px] font-mono text-muted-foreground">{s.trim()}</span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full py-4 bg-accent text-accent-foreground font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 hover:brightness-110 active:scale-95"
              >
                {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {isLoading ? "Analyzing..." : "Analyze Career Gap"}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="xl:col-span-8 space-y-6">
          {result ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4">
              {/* Gap Score & Missing Skills */}
              <div className="bg-card border border-border p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Readiness Score</h3>
                  <div className="text-2xl font-black text-accent">{result.gap_score}%</div>
                </div>
                <div className="w-full h-2 bg-foreground/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-accent transition-all duration-1000" style={{ width: `${result.gap_score}%` }} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <Target size={14} className="text-red-400" /> Skill Gaps Identified
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1 bg-red-400/10 border border-red-400/20 text-[10px] font-bold text-red-400 uppercase tracking-widest">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Learning Roadmap */}
              <div className="bg-card border border-border p-8 space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                  <BookOpen size={14} className="text-accent" /> Learning Roadmap
                </h3>
                <div className="space-y-4">
                  {result.learning_roadmap.map((step: any, i: number) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full border border-accent/30 flex items-center justify-center text-[10px] font-bold text-accent group-hover:bg-accent group-hover:text-black transition-all">
                          {i + 1}
                        </div>
                        {i < result.learning_roadmap.length - 1 && <div className="w-px h-full bg-border my-1" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{step.phase}</p>
                        <p className="text-xs font-bold text-foreground">{step.topic}</p>
                        <p className="text-[9px] text-accent font-bold uppercase tracking-widest mt-1">{step.resource_type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Certificates */}
              <div className="bg-card border border-border p-8 space-y-6 md:col-span-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                  <Award size={14} className="text-accent" /> Recommended Certifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.suggested_certificates.map((cert: any, i: number) => (
                    <div key={i} className="p-4 bg-foreground/[0.02] border border-border flex items-center justify-between group hover:border-accent transition-all">
                      <div>
                        <p className="text-xs font-bold text-foreground">{cert.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{cert.provider}</p>
                      </div>
                      <div className="px-2 py-1 bg-accent/10 text-accent text-[8px] font-black uppercase tracking-widest">
                        {cert.relevance} Relevance
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-accent/5 border border-accent/10 italic text-xs text-muted-foreground leading-relaxed">
                  " {result.advice} "
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border border-dashed border-border flex flex-col items-center justify-center text-center p-12">
              <TrendingUp size={40} className="text-muted-foreground/20 mb-4" />
              <h4 className="text-sm font-bold text-foreground uppercase tracking-widest mb-2">Ready to Map your Growth?</h4>
              <p className="text-xs text-muted-foreground max-w-xs">Select your target role and let AI identify the gaps in your technical skillset.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
