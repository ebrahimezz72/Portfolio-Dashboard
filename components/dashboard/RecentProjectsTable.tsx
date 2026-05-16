import React from "react";
import { Pencil, Trash2, LucideIcon } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";

interface Project {
  id: string | number;
  name: string;
  tech: string;
  icon: LucideIcon;
}

interface RecentProjectsTableProps {
  projects: Project[];
}

export default function RecentProjectsTable({ projects }: RecentProjectsTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Recent Projects</h2>
        <button className="text-xs font-bold text-muted-foreground hover:text-accent uppercase tracking-widest transition-colors">
          VIEW ALL
        </button>
      </div>

      <div className="bg-card border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-foreground/[0.02]">
              <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Project Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.map((project) => (
              <tr key={project.id} className="group hover:bg-foreground/[0.01] transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-foreground/5 border border-border flex items-center justify-center text-muted-foreground group-hover:text-accent transition-colors">
                      <project.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">{project.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{project.tech}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-3 text-muted-foreground">
                    <button className="hover:text-foreground transition-colors"><Pencil size={16} /></button>
                    <button className="hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
