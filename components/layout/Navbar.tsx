"use client";

import React from "react";
import { Search, Bell, Moon, ShieldCheck } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-20 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-40 px-8 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search inquiries, clients or messages..." 
            className="w-full bg-card border border-border py-2 pl-10 pr-4 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="p-2 text-muted-foreground hover:text-white transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-white transition-colors">
            <Moon size={20} />
          </button>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">EDITORIAL ENGINEERING</p>
            <p className="text-xs font-bold text-white uppercase tracking-tighter">ADMIN PANEL</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
