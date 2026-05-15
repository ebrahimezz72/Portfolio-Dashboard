import React from "react";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const currentStatus = status || "DRAFT";
  
  const getStyles = () => {
    switch (currentStatus.toUpperCase()) {
      case "PUBLISHED":
      case "ACTIVE":
        return "bg-[#1a2e25] text-[#4ade80] border border-[#4ade80]/20";
      case "DRAFT":
      case "CONTRACT":
        return "bg-[#2e261a] text-[#fbbf24] border border-[#fbbf24]/20";
      case "ARCHIVED":
        return "bg-[#2e1a1a] text-[#f87171] border border-[#f87171]/20";
      case "FULL-TIME":
        return "bg-[#1a1f2e] text-[#60a5fa] border border-[#60a5fa]/20";
      default:
        return "bg-white/5 text-muted-foreground border border-border";
    }
  };

  return (
    <span className={`text-[9px] font-black px-2 py-1 rounded-sm tracking-tighter uppercase ${getStyles()}`}>
      {currentStatus}
    </span>
  );
}
