import React from "react";
import ProjectDescriptionGenerator from "@/components/ai/ProjectDescriptionGenerator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Generator | Artisan Admin",
  description: "AI-powered project description generator for Ibrahim Ezzeldin's portfolio.",
};

export default function ProjectGeneratorPage() {
  return (
    <div className="py-6">
      <ProjectDescriptionGenerator />
    </div>
  );
}
