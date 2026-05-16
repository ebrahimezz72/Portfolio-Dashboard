"use client";

import React, { useEffect, useState } from "react";
import DashboardHeader from "@/components/shared/DashboardHeader";
import GeneralSettings from "@/components/settings/GeneralSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import MessageSettings from "@/components/settings/MessageSettings";
import { supabase } from "@/lib/supabase";
import { User, Settings as SettingsIcon, MessageSquare, Shield, Save } from "lucide-react";

type TabType = "general" | "account" | "messages" | "security";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await supabase
          .from('profile')
          .select('*')
          .single();
        
        if (data) setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon, desc: "Global metadata & visual ID" },
    { id: "account", label: "Account", icon: User, desc: "Personal profile & contact" },
    { id: "messages", label: "Messages", icon: MessageSquare, desc: "Inquiry database management" },
    { id: "security", label: "Security", icon: Shield, desc: "Access keys & protocols" },
  ];

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center border border-border bg-card">
        <p className="text-muted-foreground animate-pulse font-bold tracking-widest text-xs uppercase">Initializing System...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <DashboardHeader title="System Configuration" subtitle="CORE / ARCHITECTURE" />
        <button className="bg-accent text-accent-foreground px-8 py-3 font-black text-[10px] uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center gap-2">
          <Save size={16} />
          Commit All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">
        {/* Navigation Tabs */}
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`w-full text-left p-5 border transition-all group relative ${
                activeTab === tab.id 
                  ? "bg-foreground/5 border-border border-l-accent" 
                  : "border-transparent hover:bg-foreground/[0.02] grayscale hover:grayscale-0"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 border ${activeTab === tab.id ? "bg-accent/10 border-accent/20 text-accent" : "bg-foreground/5 border-border text-muted-foreground"}`}>
                  <tab.icon size={18} />
                </div>
                <div>
                  <p className={`text-[11px] font-black uppercase tracking-widest ${activeTab === tab.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                    {tab.label}
                  </p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-tighter mt-0.5 line-clamp-1">
                    {tab.desc}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-card border border-border p-8 lg:p-12 min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "general" && <GeneralSettings profile={profile} />}
          {activeTab === "account" && <AccountSettings profile={profile} />}
          {activeTab === "messages" && <MessageSettings />}
          {activeTab === "security" && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <Shield size={48} strokeWidth={1} />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Layer Restricted</p>
              <p className="text-xs text-muted-foreground max-w-xs">Security keys and access protocols are managed via the root terminal.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
