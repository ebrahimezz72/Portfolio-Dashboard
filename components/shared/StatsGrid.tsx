import React from "react";

interface Stat {
  label: string;
  value: string;
  sub: string;
}

interface StatsGridProps {
  stats: Stat[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card border border-border p-6 rounded-sm">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
            {stat.label}
          </p>
          <p className="text-4xl font-bold text-white tracking-tight mb-2">
            {stat.value}
          </p>
          <p className="text-[11px] text-accent/70 font-medium">
            {stat.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
