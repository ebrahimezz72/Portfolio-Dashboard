"use client";

import React, { createContext, useContext, useState } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setIsCollapsed: (value: boolean) => void;
  isProjectModalOpen: boolean;
  setIsProjectModalOpen: (value: boolean) => void;
  openProjectModal: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  const openProjectModal = () => setIsProjectModalOpen(true);

  return (
    <SidebarContext.Provider value={{ 
      isCollapsed, 
      toggleSidebar, 
      setIsCollapsed,
      isProjectModalOpen,
      setIsProjectModalOpen,
      openProjectModal,
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
