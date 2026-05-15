"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useSidebar } from "@/context/SidebarContext";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const { isCollapsed } = useSidebar();

  if (isLoginPage) {
    return <main className="h-full">{children}</main>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300`}>
        <Navbar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
