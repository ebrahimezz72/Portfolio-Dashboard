import React from "react";
import { Eye, Pencil, Trash2, LucideIcon, EyeOff } from "lucide-react";
import StatusBadge from "../shared/StatusBadge";

interface ExperienceCardProps {
  title: string;
  company: string;
  location: string;
  period: string;
  tenure: string;
  type: string;
  status?: string;
  icon: LucideIcon;
}

export default function ExperienceCard({ 
  title, 
  company, 
  location, 
  period, 
  tenure, 
  type, 
  status, 
  icon: Icon 
}: ExperienceCardProps) {
  const isArchived = status === "ARCHIVED";

  return (
    <div className={`bg-card border border-border p-6 group hover:border-accent/30 transition-all ${isArchived ? "opacity-60" : ""}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded bg-foreground/5 border border-border flex items-center justify-center text-muted-foreground group-hover:text-accent transition-colors">
            <Icon size={28} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className={`text-xl font-bold ${isArchived ? "text-muted-foreground line-through italic" : "text-foreground"}`}>
                {title}
              </h3>
              <StatusBadge status={type} />
              {status && <StatusBadge status={status} />}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground/80">{company}</span> • {location}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-10">
          <div className="text-right">
            <p className="text-sm font-bold text-foreground tracking-tight">{period}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{tenure}</p>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <button className="hover:text-foreground transition-colors">
              {isArchived ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button className="hover:text-foreground transition-colors"><Pencil size={20} /></button>
            <button className="hover:text-red-400 transition-colors"><Trash2 size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
