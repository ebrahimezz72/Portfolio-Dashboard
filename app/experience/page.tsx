"use client";

import React, { useEffect, useState } from "react";
import { Plus, Terminal, Compass, Code2, LucideIcon } from "lucide-react";
import DashboardHeader from "@/components/shared/DashboardHeader";
import StatsGrid from "@/components/shared/StatsGrid";
import ExperienceList from "@/components/experience/ExperienceList";
import ExperienceCard from "@/components/experience/ExperienceCard";
import { Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";

const getIcon = (role: string): LucideIcon => {
  if (!role) return Code2;
  if (role.includes("Front-end") || role.includes("Developer")) return Terminal;
  if (role.includes("UI") || role.includes("Designer")) return Compass;
  return Code2;
};

export default function ExperiencePage() {
  const [experience, setExperience] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExperience() {
      try {
        const { data } = await supabase
          .from('experience')
          .select('*')
          .order('display_order', { ascending: true });
        
        if (data) setExperience(data);
      } catch (error) {
        console.error("Error fetching experience:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExperience();
  }, []);

  const stats = [
    { label: "TOTAL TENURE", value: "2 Years", sub: "Across 4 industry sectors" },
    { label: "CURRENT STATUS", value: "Active Engineer", sub: "Open to advisory roles" },
    { label: "PORTFOLIO IMPACT", value: "142+", sub: "Commits this sprint" },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <DashboardHeader title="Experience Management" subtitle="VAULT / PROFESSIONAL NARRATIVE" />
        <button className="bg-accent text-accent-foreground px-6 py-3 rounded-none font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2">
          <Plus size={18} />
          Add New Position
        </button>
      </div>

      <StatsGrid stats={stats} />

      {/* List Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Chronological Archive</h2>
          <button className="p-2 bg-white/5 border border-border text-muted-foreground hover:text-white transition-colors">
            <Filter size={18} />
          </button>
        </div>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center border border-border bg-card">
            <p className="text-muted-foreground animate-pulse font-bold tracking-widest text-xs uppercase">Retrieving Archive...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {experience.map((exp) => (
              <ExperienceCard 
                key={exp.id}
                title={exp.role}
                company={exp.company}
                location={exp.city || exp.location_type || "Remote"}
                period={`${exp.period_start} — ${exp.period_end || 'Present'}`}
                tenure={exp.employment_type}
                type={exp.employment_type}
                status="ACTIVE"
                icon={getIcon(exp.role)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <footer className="pt-10 border-t border-border flex flex-col sm:flex-row justify-between gap-4">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
          LAST AUDIT: OCT 24, 2023 • DATABASE SYNC: 0.2MS
        </p>
        <div className="flex gap-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
            PUBLIC VISIBILITY ENABLED
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
            SEO OPTIMIZED STRINGS
          </p>
        </div>
      </footer>
    </div>
  );
}
