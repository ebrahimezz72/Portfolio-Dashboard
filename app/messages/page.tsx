"use client";

import React, { useEffect, useState } from "react";
import InboxSidebar from "@/components/messages/InboxSidebar";
import MessageDetail from "@/components/messages/MessageDetail";
import { supabase } from "@/lib/supabase";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const { data } = await supabase
          .from('contact_messages')
          .select('*')
          .order('sent_at', { ascending: false });
        
        if (data && data.length > 0) {
          setMessages(data);
          setActiveId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, []);
  
  const activeMessage = messages.find(m => m.id === activeId) || null;

  const mappedMessages = messages.map(m => ({
    id: m.id,
    sender: m.full_name,
    email: m.email,
    subject: m.subject || "No Subject",
    preview: m.message.substring(0, 100) + "...",
    time: new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date(m.sent_at).toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    status: m.is_read ? "READ" : "NEW",
    content: m.message,
    budget: m.budget,
    project_type: m.project_type,
    phone: m.phone_num
  }));

  const activeMappedMessage = mappedMessages.find(m => m.id === activeId);

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center border border-border bg-card">
        <p className="text-muted-foreground animate-pulse font-bold tracking-widest text-xs uppercase">Connecting to Real-time Mailbox...</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border flex flex-col lg:flex-row overflow-hidden rounded-sm">
      <InboxSidebar 
        messages={mappedMessages as any} 
        activeId={activeId || ""} 
        // @ts-ignore
        onSelect={setActiveId}
      />
      {activeMappedMessage ? (
        <MessageDetail message={activeMappedMessage as any} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Select a message to view
        </div>
      )}
    </div>
  );
}
