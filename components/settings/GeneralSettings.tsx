import React from "react";

export default function GeneralSettings({ profile }: { profile: any }) {
  return (
    <div className="space-y-8">
      <div>
        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
          SITE TITLE
        </label>
        <input 
          type="text" 
          defaultValue={profile?.site_title || "Editorial Engineering Studio"}
          className="w-full bg-foreground/[0.03] border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
        />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
          META DESCRIPTION
        </label>
        <textarea 
          rows={4}
          defaultValue={profile?.meta_description || "High-end front-end engineering and UI architecture for the modern digital artisan."}
          className="w-full bg-foreground/[0.03] border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all resize-none"
        />
      </div>
    </div>
  );
}
