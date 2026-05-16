"use client";

import React, { useEffect, useState } from "react";
import { 
  Plus, 
  FileText, 
  Palette, 
  Layout,
  Monitor,
  LucideIcon,
  Terminal
} from "lucide-react";
import DashboardHeader from "@/components/shared/DashboardHeader";
import StatsGrid from "@/components/shared/StatsGrid";
import RecentProjectsTable from "@/components/dashboard/RecentProjectsTable";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import FAB from "@/components/shared/FAB";
import { supabase } from "@/lib/supabase";
import { useSidebar } from "@/context/SidebarContext";
import { useRouter } from "next/navigation";

// Helper to map icon names
const getIcon = (name: string): LucideIcon => {
  if (!name) return Terminal;
  if (name.includes("CRM")) return Layout;
  if (name.includes("UI")) return Monitor;
  return Terminal;
};

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { openProjectModal } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        const { data: messagesData } = await supabase
          .from('contact_messages')
          .select('*')
          .order('sent_at', { ascending: false })
          .limit(5);

        if (projectsData) setProjects(projectsData);
        if (messagesData) setMessages(messagesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const stats = [
    { label: "TOTAL PROJECTS", value: projects.length.toString(), sub: "In Repository" },
    { label: "ACTIVE INQUIRIES", value: messages.filter(m => !m.is_read).length.toString(), sub: "Unread Messages" },
    { label: "SYSTEM STATUS", value: "99.9%", sub: "Operational" },
    { label: "LAST UPDATE", value: "Today", sub: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ];

  const mappedProjects = projects.map(p => ({
    id: p.id,
    name: p.title,
    tech: p.tech_stack?.join(", ") || "No tech specified",
    icon: getIcon(p.title)
  }));

  const mappedInquiries = messages.map(m => ({
    id: m.id,
    name: m.full_name,
    time: new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: m.message
  }));

  const quickActions = [
    { label: "ADD NEW PROJECT", icon: Plus, onClick: openProjectModal },
    { label: "VIEW MESSAGES", icon: FileText, onClick: () => router.push("/messages") },
    { label: "MANAGE SETTINGS", icon: Palette, onClick: () => router.push("/settings") },
  ];

  return (
    <div className="space-y-12">
      <DashboardHeader title="Welcome back, Ibrahim" subtitle="DASHBOARD OVERVIEW" />
      
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2">
          {loading ? (
            <div className="h-64 flex items-center justify-center border border-border bg-card">
              <p className="text-muted-foreground animate-pulse font-bold tracking-widest text-xs uppercase">Initializing System...</p>
            </div>
          ) : (
            <RecentProjectsTable projects={mappedProjects} />
          )}
        </div>
        <div>
          <DashboardSidebar 
            actions={quickActions} 
            inquiries={mappedInquiries} 
            serverLoad={14}
            onInquiryClick={(id) => router.push(`/messages?id=${id}`)}
          />
        </div>
      </div>

      <FAB onClick={openProjectModal} />
    </div>
  );
}
