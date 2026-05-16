"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  full_name: string;
  message: string;
  sent_at: string;
  is_read: boolean;
}

interface NotificationContextType {
  unreadMessages: Message[];
  markAsRead: (id: string) => Promise<void>;
  requestNotificationPermission: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);

  const fetchUnread = async () => {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('is_read', false)
      .order('sent_at', { ascending: false });
    
    if (data) setUnreadMessages(data);
  };

  useEffect(() => {
    fetchUnread();

    // Subscribe to new messages
    const channel = supabase
      .channel('new_messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'contact_messages' 
      }, (payload) => {
        const newMessage = payload.new as Message;
        setUnreadMessages(prev => [newMessage, ...prev]);
        
        // Browser notification
        if (Notification.permission === "granted") {
          new Notification("New Message from Artisan Portfolio", {
            body: `${newMessage.full_name}: ${newMessage.message.substring(0, 50)}...`,
            icon: "/logo.png"
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id);
    
    if (!error) {
      setUnreadMessages(prev => prev.filter(m => m.id !== id));
    }
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  };

  return (
    <NotificationContext.Provider value={{ unreadMessages, markAsRead, requestNotificationPermission }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
