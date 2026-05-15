import React from "react";
import { Plus, LucideIcon } from "lucide-react";

interface Action {
  label: string;
  icon: LucideIcon;
}

interface Inquiry {
  name: string;
  time: string;
  text: string;
}

interface DashboardSidebarProps {
  actions: Action[];
  inquiries: Inquiry[];
  serverLoad: number;
}

export default function DashboardSidebar({ actions, inquiries, serverLoad }: DashboardSidebarProps) {
  return (
    <div className="space-y-10">
      {/* Quick Actions */}
      <div className="space-y-6">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Quick Actions</h2>
        <div className="space-y-3">
          {actions.map((action) => (
            <button 
              key={action.label}
              className="w-full bg-card border border-border p-4 rounded-sm flex items-center justify-between group hover:border-accent/30 transition-all"
            >
              <span className="text-xs font-bold text-white group-hover:text-accent transition-colors tracking-widest uppercase">
                {action.label}
              </span>
              <action.icon size={18} className="text-muted-foreground group-hover:text-accent group-hover:scale-110 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* Latest Inquiries */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Latest Inquiries</h2>
          <span className="bg-accent/10 text-accent text-[9px] font-bold px-1.5 py-0.5 rounded-sm">+2 New</span>
        </div>
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.name} className="relative pl-4 border-l-2 border-border hover:border-accent transition-colors group cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold text-white group-hover:text-accent transition-colors">{inquiry.name}</p>
                <p className="text-[10px] text-muted-foreground">{inquiry.time}</p>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed italic font-light">
                "{inquiry.text}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="pt-6 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System Functional</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
            <span>Server Load</span>
            <span>{serverLoad}%</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-accent/40 rounded-full shadow-[0_0_8px_rgba(200,217,191,0.3)]" style={{ width: `${serverLoad}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
