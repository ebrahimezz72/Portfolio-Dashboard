"use client";

import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Monitor,
  Layout,
  Code,
  Box,
  Terminal,
  LucideIcon
} from "lucide-react";
import DashboardHeader from "@/components/shared/DashboardHeader";
import StatsGrid from "@/components/shared/StatsGrid";
import ProjectsFilterBar from "@/components/projects/ProjectsFilterBar";
import ProjectsTable from "@/components/projects/ProjectsTable";
import Pagination from "@/components/projects/Pagination";
import { supabase } from "@/lib/supabase";

const getIcon = (name: string): LucideIcon => {
  if (!name) return Terminal;
  if (name.includes("CRM")) return Layout;
  if (name.includes("UI")) return Monitor;
  if (name.includes("Net")) return Code;
  return Terminal;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data) setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const stats = [
    { label: "TOTAL SCALE", value: projects.length.toString(), sub: "Inventory Projects" },
    { label: "FEATURED", value: projects.filter(p => p.is_featured).length.toString(), sub: "Highlights" },
    { label: "REPOS", value: projects.filter(p => p.repo_url).length.toString(), sub: "Source Available" },
    { label: "LIVE DEMOS", value: projects.filter(p => p.live_demo_url).length.toString(), sub: "Active Previews" },
  ];

  const projectList = projects.map(p => ({
    id: p.id,
    name: p.title,
    desc: p.description || "No description provided.",
    status: p.is_featured ? "PUBLISHED" : "DRAFT",
    tech: p.tech_stack || [],
    date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    icon: getIcon(p.title)
  }));

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <DashboardHeader title="Projects Management" subtitle="STUDIO INVENTORY" />
        <button className="bg-accent text-accent-foreground px-6 py-3 rounded-none font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2">
          <Plus size={18} />
          ADD NEW PROJECT
        </button>
      </div>

      <StatsGrid stats={stats} />

      <div className="bg-card border border-border">
        <ProjectsFilterBar />
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground animate-pulse font-bold tracking-widest text-xs uppercase">Loading Projects...</p>
          </div>
        ) : (
          <ProjectsTable projects={projectList} />
        )}
        <Pagination currentCount={projects.length} totalCount={projects.length} />
      </div>

      <footer className="pt-10 text-center">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.3em]">
          ARTISAN ADMIN • PROJECTS MANAGEMENT SYSTEM • V2.4.0
        </p>
      </footer>
    </div>
  );
}
