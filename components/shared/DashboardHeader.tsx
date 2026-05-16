import React from "react";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em] mb-2">
        {subtitle}
      </p>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
        {title}
      </h1>
    </div>
  );
}
