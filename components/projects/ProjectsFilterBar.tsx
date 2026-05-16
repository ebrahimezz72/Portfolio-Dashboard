import React from "react";
import { Filter, Search } from "lucide-react";

interface ProjectsFilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ProjectsFilterBar({ activeFilter, onFilterChange, searchQuery, onSearchChange }: ProjectsFilterBarProps) {
  const filters = ["ALL", "PUBLISHED", "DRAFT"];
  
  return (
    <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
        {filters.map((f) => (
          <button 
            key={f}
            onClick={() => onFilterChange(f)}
            className={`text-[10px] font-black px-4 py-2 rounded-sm tracking-widest uppercase transition-all ${
              activeFilter === f 
                ? "bg-accent text-accent-foreground" 
                : "text-muted-foreground hover:text-foreground bg-foreground/5 hover:bg-foreground/10"
            }`}
          >
            {f === "ALL" ? "ALL PROJECTS" : f}
          </button>
        ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects locally..." 
            className="w-full bg-foreground/5 border border-transparent py-1.5 pl-9 pr-4 rounded-sm text-[10px] font-bold tracking-widest text-foreground focus:outline-none focus:border-accent transition-all uppercase placeholder:normal-case"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          SORT BY: <span className="text-foreground">CUSTOM ORDER</span>
        </span>
        <button className="p-2 bg-foreground/5 border border-border text-muted-foreground hover:text-foreground transition-colors">
          <Filter size={16} />
        </button>
      </div>
    </div>
  );
}
