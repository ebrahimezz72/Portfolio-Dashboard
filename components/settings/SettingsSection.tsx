import React from "react";

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-10 py-10 border-t border-border first:border-t-0">
      <div className="lg:w-1/3">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
          {description}
        </p>
      </div>
      <div className="lg:w-2/3">
        <div className="bg-card border border-border p-8 rounded-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
