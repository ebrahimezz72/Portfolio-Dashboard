"use client";

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense } from "react";
import { Plus, Terminal, Compass, Code2, LucideIcon } from "lucide-react";
import DashboardHeader from "@/components/shared/DashboardHeader";
import StatsGrid from "@/components/shared/StatsGrid";
import ExperienceList from "@/components/experience/ExperienceList";
import ExperienceCard from "@/components/experience/ExperienceCard";
import { Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

const getIcon = (role: string): LucideIcon => {
  if (!role) return Code2;
  if (role.includes("Front-end") || role.includes("Developer")) return Terminal;
  if (role.includes("UI") || role.includes("Designer")) return Compass;
  return Code2;
};

function ExperienceContent() {
  const [experience, setExperience] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [localSearch, setLocalSearch] = useState("");
  const searchParams = useSearchParams();

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

  useEffect(() => {
    if (!loading && experience.length > 0) {
      const urlId = searchParams.get("id");
      if (urlId) {
        setTimeout(() => {
          const el = document.getElementById(`exp-${urlId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-2', 'ring-accent', 'animate-pulse');
            setTimeout(() => el.classList.remove('ring-2', 'ring-accent', 'animate-pulse'), 3000);
          }
        }, 100);
      }
    }
  }, [loading, experience, searchParams]);

  const stats = [
    { label: "TOTAL TENURE", value: "2 Years", sub: "Across 4 industry sectors" },
    { label: "CURRENT STATUS", value: "Active Engineer", sub: "Open to advisory roles" },
    { label: "PORTFOLIO IMPACT", value: "142+", sub: "Commits this sprint" },
  ];

  const filteredExperience = experience.filter(exp => {
    // 1. Filter by Type
    if (activeFilter !== "ALL" && exp.employment_type !== activeFilter) return false;
    
    // 2. Search
    if (localSearch) {
      const q = localSearch.toLowerCase();
      if (!exp.role?.toLowerCase().includes(q) && !exp.company?.toLowerCase().includes(q)) {
        return false;
      }
    }
    
    return true;
  });

  const employmentTypes = ["ALL", ...Array.from(new Set(experience.map(e => e.employment_type)))];

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 flex-1">
            <h2 className="text-xl font-bold text-foreground tracking-tight mr-4">Chronological Archive</h2>
            {employmentTypes.map((type) => (
              <button 
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`text-[10px] font-black px-4 py-2 rounded-sm tracking-widest uppercase transition-all whitespace-nowrap ${
                  activeFilter === type 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:text-foreground bg-foreground/5"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-auto">
            <input 
              type="text"
              placeholder="Search roles or companies..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="bg-foreground/5 border border-transparent py-2 px-4 rounded-sm text-xs font-bold tracking-widest focus:outline-none focus:border-accent transition-all uppercase placeholder:normal-case w-full sm:w-64 text-foreground"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center border border-border bg-card">
            <p className="text-muted-foreground animate-pulse font-bold tracking-widest text-xs uppercase">Retrieving Archive...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExperience.map((exp) => (
              <div id={`exp-${exp.id}`} key={exp.id} className="transition-all duration-500 rounded-lg">
                <ExperienceCard 
                  title={exp.role}
                  company={exp.company}
                  location={exp.city || exp.location_type || "Remote"}
                  period={`${exp.period_start} — ${exp.period_end || 'Present'}`}
                  tenure={exp.employment_type}
                  type={exp.employment_type}
                  status="ACTIVE"
                  icon={getIcon(exp.role)}
                />
              </div>
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

export default function ExperiencePage() {
  return (
    <Suspense fallback={<div className="h-64 flex items-center justify-center"><p className="text-muted-foreground animate-pulse text-xs font-bold uppercase tracking-widest">Loading Experience...</p></div>}>
      <ExperienceContent />
    </Suspense>
  );
}
