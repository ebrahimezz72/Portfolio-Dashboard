import React, { useState } from "react";
import { ExternalLink } from "lucide-react";
import GooglePreview from "./GooglePreview";
import ScoreBar from "./ScoreBar";
import { translations } from "../ai/shared/translations";
import CopyButton from "../ai/shared/CopyButton";

interface SeoOutputData {
  title: string;
  description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  twitter_title: string;
  twitter_description: string;
  slug: string;
  seo_scores: {
    title_length: number;
    desc_length: number;
    keywords_relevance: number;
    overall: number;
  };
}

interface SeoOutputProps {
  data: SeoOutputData;
  lang: "en" | "ar";
}

export default function SeoOutput({ data, lang }: SeoOutputProps) {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<"preview" | "tags" | "html">("preview");

  const htmlCode = `<!-- SEO Meta Tags -->
<title>${data.title}</title>
<meta name="description" content="${data.description}">
<meta name="keywords" content="${data.keywords}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="${data.og_title}">
<meta property="og:description" content="${data.og_description}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="${data.twitter_title}">
<meta property="twitter:description" content="${data.twitter_description}">`;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-border">
        {["preview", "tags", "html"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab ? "text-success" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t[tab as keyof typeof t] || tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-success" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "preview" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Google Preview */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                {t.google_preview} <ExternalLink size={12} />
              </h4>
              <GooglePreview 
                title={data.title} 
                description={data.description} 
                slug={data.slug} 
              />
            </div>

            {/* SEO Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-foreground/5 p-6 border border-border">
              <div className="space-y-4">
                <ScoreBar label="Title Length" score={data.seo_scores.title_length} />
                <ScoreBar label="Description Length" score={data.seo_scores.desc_length} />
              </div>
              <div className="space-y-4">
                <ScoreBar label="Keywords Relevance" score={data.seo_scores.keywords_relevance} />
                <ScoreBar label="Overall SEO Score" score={data.seo_scores.overall} />
              </div>
            </div>

            {/* Quick Preview Fields */}
            <div className="grid grid-cols-1 gap-4">
              {Object.entries({
                title: data.title,
                description: data.description,
                keywords: data.keywords,
                slug: data.slug
              }).map(([key, value]) => (
                <div key={key} className="bg-foreground/5 border border-border p-4 flex justify-between items-center group">
                  <div className="flex-1 min-w-0 pr-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">{key}</span>
                    <p className="text-sm text-foreground truncate">{value}</p>
                  </div>
                  <CopyButton text={value} className="p-2 text-muted-foreground hover:text-success" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "tags" && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {[
              { label: "title", content: data.title },
              { label: "description", content: data.description },
              { label: "keywords", content: data.keywords },
              { label: "og:title", content: data.og_title },
              { label: "og:description", content: data.og_description },
              { label: "twitter:title", content: data.twitter_title },
              { label: "twitter:description", content: data.twitter_description },
            ].map((tag) => (
              <div key={tag.label} className="flex flex-col gap-2 p-4 bg-foreground/5 border border-border group">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-success uppercase tracking-widest">{tag.label}</span>
                  <CopyButton text={tag.content} label={t.copy} className="text-muted-foreground hover:text-foreground" />
                </div>
                <div className="text-sm font-mono text-muted-foreground break-all leading-relaxed">
                   {tag.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "html" && (
          <div className="animate-in fade-in duration-500 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{t.ready_html}</h4>
              <CopyButton 
                text={htmlCode} 
                label={t.copy_all} 
                className="px-4 py-2 bg-success/10 text-success border border-success/20 hover:bg-success hover:text-black" 
              />
            </div>
            <div className="relative">
              <pre className="p-6 bg-[#0d0f11] border border-border text-xs font-mono text-success/80 overflow-x-auto custom-scrollbar leading-relaxed">
                {htmlCode}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
