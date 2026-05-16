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
        return "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20";
      case "DRAFT":
      case "CONTRACT":
        return "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20";
      case "ARCHIVED":
        return "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error)]/20";
      case "FULL-TIME":
        return "bg-foreground/5 text-foreground/70 border-border";
      default:
        return "bg-foreground/5 text-muted-foreground border border-border";
    }
  };

  return (
    <span className={`text-[9px] font-black px-2 py-1 rounded-sm tracking-tighter uppercase ${getStyles()}`}>
      {currentStatus}
    </span>
  );
}
