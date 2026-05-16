"use client";

import React, { useEffect, useState, Suspense } from "react";
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
import ProjectModal from "@/components/projects/ProjectModal";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/context/ToastContext";

const getIcon = (name: string): LucideIcon => {
  if (!name) return Terminal;
  if (name.includes("CRM")) return Layout;
  if (name.includes("UI")) return Monitor;
  if (name.includes("Net")) return Code;
  return Terminal;
};

function ProjectsContent() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toastSuccess, toastError, showConfirm } = useToast();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const searchParams = useSearchParams();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (data) {
        setProjects(data);
        const urlId = searchParams.get("id");
        if (urlId) {
          const p = data.find((proj) => proj.id === urlId);
          if (p) {
            setSelectedProject(p);
            setIsModalOpen(true);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string | number) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setSelectedProject(project);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: string | number) => {
    showConfirm({
      title: "Delete Project",
      message: "Are you sure you want to delete this project? This action cannot be undone.",
      confirmText: "Delete",
      danger: true,
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('projects').delete().eq('id', id);
          if (error) throw error;
          toastSuccess("Project deleted successfully.");
          fetchProjects();
        } catch (error) {
          toastError("Failed to delete project.");
        }
      }
    });
  };

  const handleAddNew = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchProjects();
  }, [searchParams]);

  const stats = [
    { label: "TOTAL SCALE", value: projects.length.toString(), sub: "Inventory Projects" },
    { label: "FEATURED", value: projects.filter(p => p.is_featured).length.toString(), sub: "Highlights" },
    { label: "REPOS", value: projects.filter(p => p.repo_url).length.toString(), sub: "Source Available" },
    { label: "LIVE DEMOS", value: projects.filter(p => p.live_demo_url).length.toString(), sub: "Active Previews" },
  ];

  const filteredProjects = projects.filter(p => {
    // 1. Status Filter
    if (activeFilter === "PUBLISHED" && p.is_featured === false) return false;
    if (activeFilter === "DRAFT" && p.is_featured === true) return false;
    
    // 2. Search Filter
    if (localSearchQuery) {
      const q = localSearchQuery.toLowerCase();
      if (!p.title?.toLowerCase().includes(q) && !p.description?.toLowerCase().includes(q)) {
        return false;
      }
    }
    
    return true;
  });

  const projectList = filteredProjects.map(p => ({
    id: p.id,
    name: p.title,
    desc: p.description || "No description provided.",
    tech: p.tech_stack || [],
    date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    icon: getIcon(p.title),
    repoUrl: p.repo_url,
    order: p.display_order || 0
  }));

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <DashboardHeader title="Projects Management" subtitle="STUDIO INVENTORY" />
        <button 
          onClick={handleAddNew}
          className="bg-accent text-accent-foreground px-6 py-3 rounded-none font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          ADD NEW PROJECT
        </button>
      </div>

      <StatsGrid stats={stats} />

      <div className="bg-card border border-border">
        <ProjectsFilterBar 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
          searchQuery={localSearchQuery}
          onSearchChange={setLocalSearchQuery}
        />
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground animate-pulse font-bold tracking-widest text-xs uppercase">Loading Projects...</p>
          </div>
        ) : (
          <ProjectsTable 
            projects={projectList} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        <Pagination currentCount={filteredProjects.length} totalCount={projects.length} />
      </div>

      <footer className="pt-10 text-center">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.3em]">
          ARTISAN ADMIN • PROJECTS MANAGEMENT SYSTEM • V2.4.0
        </p>
      </footer>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }} 
        onSuccess={fetchProjects} 
        project={selectedProject}
      />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="h-64 flex items-center justify-center"><p className="text-muted-foreground animate-pulse text-xs font-bold uppercase tracking-widest">Loading...</p></div>}>
      <ProjectsContent />
    </Suspense>
  );
}
