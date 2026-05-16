import React from "react";

interface SkillCategoryCardProps {
  title: string;
  count?: number;
  skills: string[];
  onClick?: () => void;
}

export default function SkillCategoryCard({ title, count, skills, onClick }: SkillCategoryCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-card border border-border p-6 hover:border-accent/30 transition-all group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
          {title}
        </h3>
        <span className="bg-foreground/5 text-muted-foreground text-[10px] font-bold px-2 py-1 rounded-sm border border-border">
          {count} Skills
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span 
            key={skill} 
            className="bg-foreground/5 text-muted-foreground text-xs px-4 py-2 rounded-sm border border-border hover:bg-white/10 hover:text-foreground transition-all cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
