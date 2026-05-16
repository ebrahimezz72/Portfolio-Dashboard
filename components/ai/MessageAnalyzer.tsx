"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  BadgeInfo, 
  Mail, 
  ChevronRight,
  ShieldAlert,
  Zap,
  RefreshCw,
  Copy
} from "lucide-react";
import { translations } from "./shared/translations";
import LanguageToggle from "./shared/LanguageToggle";
import CopyButton from "./shared/CopyButton";

interface MessageAnalyzerProps {
  message: {
    sender: string;
    email: string;
    phone?: string;
    content: string;
  };
}

export default function MessageAnalyzer({ message }: MessageAnalyzerProps) {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tone, setTone] = useState("Friendly");

  const t = translations[lang];

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/analyze-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...message,
          name: message.sender,
          language: lang === 'en' ? 'English' : 'Arabic'
        }),
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateReply = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/smart-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: message.sender,
          originalMessage: message.content,
          tone,
          language: lang === 'en' ? 'English' : 'Arabic'
        }),
      });
      const data = await response.json();
      setAnalysis({ ...analysis, suggested_reply: data.full_email });
    } catch (error) {
      console.error("Reply generation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'job_offer': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'freelance_project': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'collaboration': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'spam': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-muted-foreground bg-foreground/5 border-border';
    }
  };

  if (!analysis) {
    return (
      <div className="bg-card border border-border p-6 mt-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-accent/50" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 text-accent border border-accent/20 rounded-sm">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">AI Inbox Assistant</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Classify & Summarize this message</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle lang={lang} setLang={setLang} />
            <button 
              onClick={handleAnalyze}
              disabled={isLoading}
              className="bg-accent text-accent-foreground px-6 py-3 font-black text-[10px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
              Analyze Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 mt-8 animate-in slide-in-from-bottom-4 duration-500 ${lang === 'ar' ? 'font-arabic' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Analysis Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card border border-border p-6 relative">
            <div className={`absolute top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-1 h-full bg-accent/50`} />
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">AI Analysis</h3>
              <div className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border ${getCategoryColor(analysis.category)}`}>
                {analysis.category.replace('_', ' ')}
              </div>
            </div>

            <div className="space-y-6">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <BadgeInfo size={12} className="text-accent" /> Summary
                </div>
                <p className="text-sm text-foreground leading-relaxed italic border-l-2 border-border pl-4">
                  "{analysis.summary}"
                </p>
              </div>

              {/* Key Info Chips */}
              <div className="flex flex-wrap gap-2">
                {analysis.key_info.budget_mentioned && (
                  <span className="px-2 py-1 bg-green-500/10 text-green-500 border border-green-500/20 text-[9px] font-bold uppercase tracking-widest">Budget Mentioned</span>
                )}
                {analysis.key_info.deadline_mentioned && (
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[9px] font-bold uppercase tracking-widest">Deadline Included</span>
                )}
                {analysis.key_info.company_mentioned && (
                  <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[9px] font-bold uppercase tracking-widest">Corporate Entity</span>
                )}
              </div>

              {/* Tech Mentioned */}
              {analysis.key_info.tech_mentioned.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Technologies</div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.key_info.tech_mentioned.map((tech: string) => (
                      <span key={tech} className="px-2 py-0.5 bg-foreground/5 border border-border text-[9px] font-mono text-muted-foreground">{tech}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Items */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <ChevronRight size={12} className="text-accent" /> Action Items
                </div>
                {analysis.action_items.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-foreground/[0.02] border border-border text-xs">
                    <div className="w-4 h-4 border border-accent/30 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-accent/50" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              {/* Urgency */}
              <div className="flex items-center justify-between p-4 bg-foreground/[0.03] border border-border">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Response Urgency</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-accent">{analysis.response_urgency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Suggested Reply */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card border border-border p-8 relative flex flex-col h-full">
            <div className={`absolute top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-1 h-full bg-success/50`} />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 text-success border border-success/20 rounded-sm">
                  <Mail size={18} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Suggested Reply</h3>
              </div>
              <div className="flex items-center gap-3">
                <select 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="bg-foreground/5 border border-border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-success transition-all"
                >
                  <option value="Friendly">Friendly</option>
                  <option value="Formal">Formal</option>
                  <option value="Concise">Concise</option>
                </select>
                <button 
                  onClick={handleRegenerateReply}
                  disabled={isLoading}
                  className="p-2 bg-foreground/5 border border-border hover:text-success transition-colors disabled:opacity-50"
                  title="Regenerate with tone"
                >
                  <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-black/20 border border-border p-6 font-mono text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed relative group">
              {analysis.suggested_reply}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton text={analysis.suggested_reply} className="bg-background/80 backdrop-blur-sm p-2 border border-border shadow-xl hover:text-success" />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button className="flex-1 bg-success text-black py-4 font-black text-[11px] uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all">
                Use this reply
              </button>
              <button 
                onClick={() => setAnalysis(null)}
                className="px-8 bg-foreground/5 border border-border text-muted-foreground font-black text-[11px] uppercase tracking-widest hover:text-red-400 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
