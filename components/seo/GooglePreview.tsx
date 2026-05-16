"use client";

import React from "react";

interface GooglePreviewProps {
  title: string;
  description: string;
  slug?: string;
}

export default function GooglePreview({ title, description, slug = "your-page" }: GooglePreviewProps) {
  const displayUrl = `https://ibrahimezzeldin.com/${slug}`;

  return (
    <div className="bg-white dark:bg-[#1e1e1e] border border-border p-5 rounded-sm shadow-sm max-w-2xl">
      <div className="flex flex-col gap-1">
        <div className="text-[14px] text-[#202124] dark:text-[#bdc1c6] truncate">
          {displayUrl}
        </div>
        <h3 className="text-[20px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-tight truncate">
          {title || "Page Title Goes Here"}
        </h3>
        <p className="text-[14px] text-[#4d5156] dark:text-[#bdc1c6] leading-normal line-clamp-2 mt-1">
          {description || "Provide a compelling meta description to see how your page will look in Google search results."}
        </p>
      </div>
    </div>
  );
}
