import React from "react";
import SeoGenerator from "@/components/seo/SeoGenerator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Generator | Artisan Admin",
  description: "AI-powered SEO meta tags generator for Ibrahim Ezzeldin's portfolio.",
};

export default function SeoGeneratorPage() {
  return (
    <div className="py-6">
      <SeoGenerator />
    </div>
  );
}
