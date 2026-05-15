import React from "react";
import { Filter } from "lucide-react";

export default function ProjectsFilterBar() {
  return (
    <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <button className="bg-white/10 text-white text-[10px] font-bold px-4 py-2 rounded-sm tracking-widest uppercase">
          ALL STATUS
        </button>
        <button className="text-muted-foreground text-[10px] font-bold px-4 py-2 hover:text-white transition-colors tracking-widest uppercase">
          PUBLISHED
        </button>
        <button className="text-muted-foreground text-[10px] font-bold px-4 py-2 hover:text-white transition-colors tracking-widest uppercase">
          DRAFTS
        </button>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          SORT BY: <span className="text-white">NEWEST</span>
        </span>
        <button className="p-2 bg-white/5 border border-border text-muted-foreground hover:text-white transition-colors">
          <Filter size={16} />
        </button>
      </div>
    </div>
  );
}
