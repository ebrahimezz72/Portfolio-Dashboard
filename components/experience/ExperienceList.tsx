import React from "react";
import { Filter, Terminal, Compass, Code2 } from "lucide-react";
import ExperienceCard from "./ExperienceCard";

const experienceData = [
  {
    title: "Senior Front-end Engineer",
    company: "Lumina Digital Agency",
    location: "San Francisco, CA",
    period: "2021 — Present",
    tenure: "3 YEARS 4 MONTHS",
    type: "FULL-TIME",
    status: "ACTIVE",
    icon: Terminal
  },
  {
    title: "UI Architecture Consultant",
    company: "Aether Solutions",
    location: "Remote",
    period: "2019 — 2021",
    tenure: "2 YEARS 1 MONTH",
    type: "CONTRACT",
    icon: Compass
  },
  {
    title: "Junior Web Developer",
    company: "Nexus Media Hub",
    location: "London, UK",
    period: "2017 — 2019",
    tenure: "2 YEARS",
    type: "FULL-TIME",
    status: "ARCHIVED",
    icon: Code2
  }
];

export default function ExperienceList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Chronological Archive</h2>
        <button className="p-2 bg-foreground/5 border border-border text-muted-foreground hover:text-foreground transition-colors">
          <Filter size={18} />
        </button>
      </div>
      <div className="space-y-4">
        {experienceData.map((exp, index) => (
          <ExperienceCard key={index} {...exp} />
        ))}
      </div>
    </div>
  );
}
