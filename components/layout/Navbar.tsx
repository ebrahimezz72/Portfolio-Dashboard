"use client";

import React from "react";
import { Search, Bell, Moon, Sun, ShieldCheck, Menu, Mail, Clock, Plus } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useSidebar } from "@/context/SidebarContext";
import { useNotifications } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const { unreadMessages, markAsRead, requestNotificationPermission } = useNotifications();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const notificationRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    setIsSearching(true);
    setShowSearch(true);

    try {
      const results = [];

      // Search Projects
      const { data: projects } = await supabase
        .from('projects')
        .select('id, title')
        .ilike('title', `%${query}%`)
        .limit(5);
      if (projects) results.push(...projects.map(p => ({ ...p, type: 'Project', link: `/projects?id=${p.id}` })));

      // Search Certificates
      const { data: certs } = await supabase
        .from('certificates')
        .select('id, title')
        .ilike('title', `%${query}%`)
        .limit(5);
      if (certs) results.push(...certs.map(c => ({ ...c, title: c.title, type: 'Certificate', link: `/certificates?id=${c.id}` })));

      // Search Experience
      const { data: exp } = await supabase
        .from('experience')
        .select('id, role, company')
        .or(`role.ilike.%${query}%,company.ilike.%${query}%`)
        .limit(5);
      if (exp) results.push(...exp.map(e => ({ ...e, title: `${e.role} at ${e.company}`, type: 'Experience', link: `/experience?id=${e.id}` })));

      // Search Messages
      const { data: msgs } = await supabase
        .from('contact_messages')
        .select('id, full_name')
        .ilike('full_name', `%${query}%`)
        .limit(5);
      if (msgs) results.push(...msgs.map(m => ({ ...m, title: m.full_name, type: 'Message', link: `/messages?id=${m.id}` })));

      setSearchResults(results);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleNotificationClick = async (msg: any) => {
    await markAsRead(msg.id);
    setShowNotifications(false);
    router.push("/messages");
  };

  React.useEffect(() => {
    // Prompt for browser notifications on first load
    requestNotificationPermission();
  }, []);

  return (
    <header className="h-20 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-40 px-8 flex items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-muted-foreground hover:text-accent transition-colors"
        >
          <Menu size={20} />
        </button>
        
        {/* Search Bar */}
        <div className="relative w-64 md:w-96" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowSearch(true)}
            placeholder="Search inquiries, projects, skills..." 
            className="w-full bg-card border border-border py-2 pl-10 pr-4 rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
          />

          {/* Search Results Dropdown */}
          {showSearch && (
            <div className="absolute top-full left-0 mt-2 w-full bg-card border border-border shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden">
              <div className="p-3 border-b border-border bg-foreground/[0.01]">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {isSearching ? "Scanning Databases..." : `Found ${searchResults.length} Global Matches`}
                </p>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {searchResults.length === 0 && !isSearching ? (
                  <div className="p-8 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">No matching records found</p>
                  </div>
                ) : (
                  searchResults.map((res, i) => (
                    <button 
                      key={i}
                      onClick={() => { router.push(res.link); setShowSearch(false); }}
                      className="w-full text-left p-4 hover:bg-foreground/[0.02] transition-colors border-b border-border last:border-0 flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">{res.title || res.role}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{res.type}</p>
                      </div>
                      <div className="p-2 bg-foreground/5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus size={14} className="text-accent" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-muted-foreground hover:text-accent transition-colors relative"
          >
            <Bell size={20} />
            {unreadMessages.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div 
              style={{ width: '600px', minWidth: '600px' }}
              className="absolute top-full right-0 mt-2 bg-card border border-border shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-50"
            >
              <div className="p-5 border-b border-border flex items-center justify-between bg-foreground/[0.01]">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">Recent Inquiries</h3>
                <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5">{unreadMessages.length} New</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {unreadMessages.length === 0 ? (
                  <div className="p-10 text-center">
                    <Mail className="mx-auto text-muted-foreground/30 mb-3" size={32} />
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">All caught up</p>
                  </div>
                ) : (
                  unreadMessages.map((msg) => (
                    <button 
                      key={msg.id}
                      onClick={() => handleNotificationClick(msg)}
                      className="w-full text-left p-4 border-b border-border/50 hover:bg-foreground/[0.02] transition-colors group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">{msg.full_name}</p>
                        <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase">
                          <Clock size={10} />
                          {new Date(msg.sent_at).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">
                        "{msg.message}"
                      </p>
                    </button>
                  ))
                )}
              </div>
              <button 
                onClick={() => { router.push("/messages"); setShowNotifications(false); }}
                className="w-full p-3 text-[10px] font-bold text-muted-foreground hover:text-accent uppercase tracking-widest border-t border-border bg-foreground/[0.01]"
              >
                View All Messages
              </button>
            </div>
          )}

          <button 
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-accent transition-colors"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">EDITORIAL ENGINEERING</p>
            <p className="text-xs font-bold text-foreground uppercase tracking-tighter">ADMIN PANEL</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
