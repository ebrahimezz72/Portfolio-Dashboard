"use client";

import React, { useEffect, useState } from "react";
import DashboardHeader from "@/components/shared/DashboardHeader";
import StatsGrid from "@/components/shared/StatsGrid";
import SkillCategoryCard from "@/components/certificates/SkillCategoryCard";
import CredentialsTable from "@/components/certificates/CredentialsTable";
import { supabase } from "@/lib/supabase";
import CertificateModal from "@/components/certificates/CertificateModal";
import ViewCertificateModal from "@/components/certificates/ViewCertificateModal";
import CategorySkillsModal from "@/components/certificates/CategorySkillsModal";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import AddCategoryModal from "@/components/shared/AddCategoryModal";

export default function CertificatesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [viewCert, setViewCert] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [localSearch, setLocalSearch] = useState("");
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const { toastSuccess, toastError, showConfirm } = useToast();

  const fetchData = async () => {
    setLoading(true);
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
      if (certData) {
        setCertificates(certData);
        const urlId = searchParams.get("id");
        if (urlId) {
          const c = certData.find((cert) => cert.id === urlId);
          if (c) {
            setViewCert({
              name: c.title,
              org: c.issuer || "N/A",
              date: c.issued_year?.toString() || "N/A",
              id: c.id,
              type: c.icon_type || "Professional",
              url: c.credential_url,
              imageUrl: c.image_url
            });
            setIsViewModalOpen(true);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching skills/certs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    const cert = certificates.find(c => c.id === id);
    if (cert) {
      setSelectedCert(cert);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm({
      title: "Delete Certificate",
      message: "Are you sure you want to delete this certificate? This action cannot be undone.",
      confirmText: "Delete",
      danger: true,
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('certificates').delete().eq('id', id);
          if (error) throw error;
          toastSuccess("Certificate deleted.");
          fetchData();
        } catch (error) {
          toastError("Failed to delete certificate.");
        }
      }
    });
  };

  const handleAddNew = () => {
    setSelectedCert(null);
    setIsModalOpen(true);
  };

  const handleView = (id: string) => {
    const cert = mappedCerts.find(c => c.id === id);
    if (cert) {
      setViewCert(cert);
      setIsViewModalOpen(true);
    }
  };

  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleAddCategory = async (name: string) => {
    try {
      const { error } = await supabase
        .from('skill_categories')
        .insert([{ name, display_order: categories.length + 1 }])
        .select();
      if (error) throw error;
      toastSuccess(`Domain "${name}" created.`);
      fetchData();
    } catch (error) {
      toastError("Failed to create category.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const stats = [
    { label: "TECH STACK SIZE", value: categories.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0).toString(), sub: "Verified Skills" },
    { label: "VERIFIED CREDENTIALS", value: certificates.length.toString(), sub: "Industry Standards" },
    { label: "LAST UPDATE", value: "Oct 2023", sub: "Performance Audit" },
  ];

  const filteredCerts = certificates.filter(cert => {
    // 1. Type Filter
    if (activeFilter !== "ALL" && cert.icon_type !== activeFilter) return false;
    
    // 2. Search Filter
    if (localSearch) {
      const q = localSearch.toLowerCase();
      if (!cert.title?.toLowerCase().includes(q) && !cert.issuer?.toLowerCase().includes(q)) {
        return false;
      }
    }
    
    return true;
  });

  const certTypes = ["ALL", ...Array.from(new Set(certificates.map(c => c.icon_type)))];

  const mappedCategories = categories.map(cat => ({
    title: cat.name,
    skills: cat.skills?.map((s: any) => s.name) || []
  }));

  const mappedCerts = filteredCerts.map(c => ({
    name: c.title,
    org: c.issuer || "N/A",
    date: c.issued_year?.toString() || "N/A",
    id: c.id,
    type: c.icon_type || "Professional",
    url: c.credential_url,
    imageUrl: c.image_url
  }));

  return (
    <div className="space-y-12 pb-20">
      <DashboardHeader title="Skills & Certificates" subtitle="CAPABILITIES / PROOF OF WORK" />

      <StatsGrid stats={stats} />

      {/* Skills Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground tracking-tight uppercase">Technical Domains</h2>
            <button 
                onClick={() => setIsAddCategoryModalOpen(true)}
                className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline"
            >
                Add Domain
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
             Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-48 bg-card border border-border animate-pulse" />
            ))
          ) : (
            categories.map((category) => (
              <SkillCategoryCard 
                key={category.id} 
                title={category.name} 
                count={category.skills?.length || 0}
                skills={category.skills?.map((s: any) => s.name) || []} 
                onClick={() => handleCategoryClick(category)}
              />
            ))
          )}
        </div>
      </section>

      {/* Credentials Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-foreground tracking-tight uppercase">Verified Credentials</h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {certTypes.map((type) => (
                <button 
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`text-[9px] font-black px-3 py-1.5 rounded-sm tracking-widest uppercase transition-all whitespace-nowrap ${
                    activeFilter === type 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground hover:text-foreground bg-foreground/5"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input 
              type="text"
              placeholder="Search credentials..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="bg-foreground/5 border border-transparent py-1.5 px-3 rounded-sm text-[10px] font-bold tracking-widest focus:outline-none focus:border-accent transition-all uppercase placeholder:normal-case w-full sm:w-48 text-foreground"
            />
            <button 
              onClick={handleAddNew}
              className="bg-accent text-accent-foreground px-4 py-2 font-bold text-[10px] uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2 h-fit"
            >
              <Plus size={14} />
              Add Certificate
            </button>
          </div>
        </div>
        {loading ? (
          <div className="h-64 flex items-center justify-center border border-border bg-card">
            <p className="text-muted-foreground animate-pulse font-bold tracking-widest text-xs uppercase">Verifying Certificates...</p>
          </div>
        ) : (
          <CredentialsTable 
            credentials={mappedCerts} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}
      </section>

      <CertificateModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCert(null);
        }} 
        onSuccess={fetchData} 
        certificate={selectedCert}
      />

      <ViewCertificateModal 
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewCert(null);
        }}
        certificate={viewCert}
      />

      <CategorySkillsModal 
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setSelectedCategory(null);
        }}
        onSuccess={fetchData}
        category={selectedCategory}
      />

      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onAdd={handleAddCategory}
      />
    </div>
  );
}
