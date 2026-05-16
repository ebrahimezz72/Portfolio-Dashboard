"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, CheckCircle, Eye, Search, AlertCircle, RefreshCw } from "lucide-react";

export default function MessageSettings() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('sent_at', { ascending: false });
    
    if (data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this message record?")) return;
    
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setMessages(messages.filter(m => m.id !== id));
    }
  };

  const toggleRead = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: !currentStatus })
      .eq('id', id);
    
    if (!error) {
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: !currentStatus } : m));
    }
  };

  const filteredMessages = messages.filter(m => 
    m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-1">Inquiry Database</h3>
          <p className="text-[11px] text-muted-foreground uppercase tracking-tighter">Raw message records management</p>
        </div>
        <button 
          onClick={fetchMessages}
          className="p-2 text-muted-foreground hover:text-accent transition-colors"
          title="Refresh Table"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Search & Filter */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <input 
          type="text" 
          placeholder="Filter by name, email, or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-foreground/[0.02] border border-border py-3 pl-12 pr-4 text-xs text-foreground focus:outline-none focus:border-accent transition-all"
        />
      </div>

      {/* Table */}
      <div className="border border-border overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-foreground/5 border-b border-border">
              <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sender</th>
              <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Project / Budget</th>
              <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  Synchronizing with Cluster...
                </td>
              </tr>
            ) : filteredMessages.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  No records found.
                </td>
              </tr>
            ) : (
              filteredMessages.map((msg) => (
                <tr key={msg.id} className="hover:bg-foreground/[0.01] transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-foreground">{msg.full_name}</p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{msg.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[10px] text-foreground font-bold">{msg.project_type || "General"}</p>
                    <p className="text-[9px] text-accent font-medium tracking-widest">{msg.budget || "No Budget"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => toggleRead(msg.id, msg.is_read)}
                        className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border transition-all ${
                          msg.is_read 
                            ? "bg-foreground/5 border-border text-muted-foreground" 
                            : "bg-accent/10 border-accent/30 text-accent"
                        }`}
                      >
                        {msg.is_read ? "READ" : "NEW"}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleDelete(msg.id)}
                        className="p-2 text-muted-foreground hover:text-red-400 transition-colors"
                        title="Delete Permanently"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-foreground/[0.02] border border-border flex items-start gap-4">
        <AlertCircle size={18} className="text-accent shrink-0 mt-0.5" />
        <p className="text-[10px] text-muted-foreground leading-relaxed uppercase tracking-tighter">
          Changes made to the inquiry database are persistent. Deleting a record is irreversible and will remove all associated contact metadata from the system.
        </p>
      </div>
    </div>
  );
}
