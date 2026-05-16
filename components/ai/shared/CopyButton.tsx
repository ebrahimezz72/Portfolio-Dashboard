"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({ text, label, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 transition-all ${className}`}
      title={label || "Copy to clipboard"}
    >
      {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
      {label && <span className="text-[10px] font-bold uppercase tracking-widest">{copied ? "Copied" : label}</span>}
    </button>
  );
}
