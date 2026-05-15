import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentCount: number;
  totalCount: number;
}

export default function Pagination({ currentCount, totalCount }: PaginationProps) {
  return (
    <div className="px-6 py-6 flex items-center justify-between border-t border-border">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        Showing {currentCount} of {totalCount} projects
      </span>
      <div className="flex gap-2">
        <button className="bg-white/5 border border-border text-muted-foreground text-[10px] font-bold px-4 py-2 uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-1">
          <ChevronLeft size={14} />
          Previous
        </button>
        <button className="bg-white/10 border border-border text-white text-[10px] font-bold px-4 py-2 uppercase tracking-widest hover:bg-white/20 transition-colors flex items-center gap-1">
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
