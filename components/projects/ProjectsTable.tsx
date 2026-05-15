import React from "react";
import { Pencil, Trash2, ExternalLink, LucideIcon } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";

interface Project {
  id: string | number;
  name: string;
  desc: string;
  status: string;
  tech: string[];
  date: string;
  icon: LucideIcon;
}

interface ProjectsTableProps {
  projects: Project[];
}

export default function ProjectsTable({ projects }: ProjectsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-white/[0.01]">
            <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Project Details</th>
            <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Status</th>
            <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Technologies</th>
            <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Last Updated</th>
            <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {projects.map((project) => (
            <tr key={project.id} className="group hover:bg-white/[0.01] transition-colors">
              <td className="px-6 py-6 min-w-[300px]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-white/5 border border-border flex items-center justify-center text-muted-foreground group-hover:text-accent transition-colors">
                    <project.icon size={24} />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white group-hover:text-accent transition-colors">{project.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 max-w-xs">{project.desc}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-6 text-center">
                <StatusBadge status={project.status} />
              </td>
              <td className="px-6 py-6">
                <div className="flex flex-wrap justify-center gap-2">
                  {project.tech.map((t) => (
                    <span key={t} className="bg-white/5 text-muted-foreground text-[10px] px-2 py-1 rounded-full border border-border whitespace-nowrap">
                      {t}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-6 text-center text-xs text-muted-foreground">
                {project.date}
              </td>
              <td className="px-6 py-6 text-right">
                <div className="flex items-center justify-end gap-3 text-muted-foreground">
                  <button className="hover:text-white transition-colors"><Pencil size={18} /></button>
                  <button className="hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                  <button className="hover:text-accent transition-colors"><ExternalLink size={18} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
