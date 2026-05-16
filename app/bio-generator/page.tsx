import React from "react";
import BioGenerator from "@/components/ai/BioGenerator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bio Generator | Artisan Admin",
  description: "AI-powered personal branding and bio updater for Ibrahim Ezzeldin's portfolio.",
};

export default function BioGeneratorPage() {
  return (
    <div className="py-6">
      <BioGenerator />
    </div>
  );
}
