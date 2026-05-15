"use client";

import React, { useEffect, useState } from "react";
import DashboardHeader from "@/components/shared/DashboardHeader";
import StatsGrid from "@/components/shared/StatsGrid";
import SkillCategoryCard from "@/components/certificates/SkillCategoryCard";
import CredentialsTable from "@/components/certificates/CredentialsTable";
import { supabase } from "@/lib/supabase";

export default function CertificatesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: catData } = await supabase
          .from('skill_categories')
          .select('*, skills(*)')
          .order('display_order', { ascending: true });
        
        const { data: certData } = await supabase
          .from('certificates')
          .select('*')
          .order('display_order', { ascending: true });

        if (catData) setCategories(catData);
        if (certData) setCertificates(certData);
      } catch (error) {
        console.error("Error fetching skills/certs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const stats = [
    { label: "TECH STACK SIZE", value: categories.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0).toString(), sub: "Verified Skills" },
    { label: "VERIFIED CREDENTIALS", value: certificates.length.toString(), sub: "Industry Standards" },
    { label: "LAST UPDATE", value: "Oct 2023", sub: "Performance Audit" },
  ];

  const mappedCategories = categories.map(cat => ({
    title: cat.name,
    skills: cat.skills?.map((s: any) => s.name) || []
  }));

  const mappedCerts = certificates.map(c => ({
    name: c.title,
    org: c.issuer || "N/A",
    date: c.issued_year?.toString() || "N/A",
    id: c.id,
    type: c.icon_type || "Professional"
  }));

  return (
    <div className="space-y-12 pb-20">
      <DashboardHeader title="Skills & Certificates" subtitle="CAPABILITIES / PROOF OF WORK" />

      <StatsGrid stats={stats} />

      {/* Skills Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight uppercase">Technical Domains</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
             Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-48 bg-card border border-border animate-pulse" />
            ))
          ) : (
            mappedCategories.map((category) => (
              <SkillCategoryCard 
                key={category.title} 
                title={category.title} 
                skills={category.skills} 
              />
            ))
          )}
        </div>
      </section>

      {/* Credentials Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight uppercase">Verified Credentials</h2>
          <button className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline transition-all">
            MANAGE EXTERNAL PROFILES
          </button>
        </div>
        {loading ? (
          <div className="h-64 flex items-center justify-center border border-border bg-card">
            <p className="text-muted-foreground animate-pulse font-bold tracking-widest text-xs uppercase">Verifying Certificates...</p>
          </div>
        ) : (
          <CredentialsTable credentials={mappedCerts} />
        )}
      </section>
    </div>
  );
}
