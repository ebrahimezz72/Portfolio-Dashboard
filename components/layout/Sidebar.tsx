"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  User as UserIcon, 
  MessageSquare, 
  Settings, 
  Award, 
  Plus,
  LogOut,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useSidebar } from "@/context/SidebarContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Briefcase, label: "Projects", href: "/projects" },
  { icon: UserIcon, label: "Experience", href: "/experience" },
  { icon: Award, label: "Certificates", href: "/certificates" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className={`${isCollapsed ? "w-20" : "w-72"} bg-black border-r border-border flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 overflow-hidden`}>
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between min-h-[100px]">
        {!isCollapsed && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="w-10 h-10 shrink-0">
              <img src="/logo.png" alt="Artisan Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-[0.2em] text-white uppercase">
                Artisan <span className="text-accent">Admin</span>
              </h1>
              <p className="text-[8px] text-muted-foreground uppercase tracking-[0.3em] font-bold">
                Engineering Studio
              </p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto w-10 h-10 animate-in fade-in zoom-in duration-500">
             <img src="/logo.png" alt="Artisan Logo" className="w-full h-full object-contain" />
          </div>
        )}
        {!isCollapsed && (
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-none bg-white/5 border border-border text-muted-foreground hover:text-white transition-all"
          >
            <PanelLeftClose size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label} 
                href={item.href}
                className={`flex items-center gap-4 px-4 py-4 rounded-none transition-all duration-300 group relative ${
                  isActive 
                    ? "text-accent bg-white/5" 
                    : `text-muted-foreground hover:text-white ${isCollapsed ? "hover:bg-accent/10" : "hover:bg-white/[0.02]"}`
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
                )}
                <item.icon 
                  size={isCollapsed ? 32 : 20} 
                  className={`${isActive ? "text-accent" : "group-hover:text-white"} transition-all duration-300 ${isCollapsed ? "group-hover:scale-110 drop-shadow-[0_0_8px_rgba(200,217,191,0.3)]" : ""}`} 
                />
                {!isCollapsed && (
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] animate-in fade-in slide-in-from-left-2">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Action Footer */}
      <div className="p-4 border-t border-border bg-white/[0.01]">
        {!isCollapsed ? (
          <button className="w-full bg-accent text-accent-foreground py-4 rounded-none font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95 mb-6">
            <Plus size={16} strokeWidth={3} />
            NEW PROJECT
          </button>
        ) : (
          <button className="w-full aspect-square bg-accent text-accent-foreground rounded-none flex items-center justify-center hover:brightness-110 transition-all mb-6">
            <Plus size={18} strokeWidth={3} />
          </button>
        )}

        {/* User Profile */}
        <div className={`flex items-center gap-4 p-4 bg-white/5 border border-border group cursor-pointer hover:bg-accent/10 transition-all ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-10 h-10 rounded-sm bg-white/5 border border-border flex items-center justify-center text-muted-foreground group-hover:text-accent transition-colors shrink-0">
            <UserIcon 
              size={isCollapsed ? 32 : 20} 
              className={`transition-all duration-300 ${isCollapsed ? "group-hover:scale-110 drop-shadow-[0_0_8px_rgba(200,217,191,0.3)]" : ""}`}
            />
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2">
                <p className="text-xs font-bold text-white truncate">Ibrahim Ezzeldin</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest truncate">Lead Engineer</p>
              </div>
              <button 
                onClick={handleSignOut}
                className="p-2 text-muted-foreground hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
