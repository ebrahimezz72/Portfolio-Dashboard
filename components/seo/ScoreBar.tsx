"use client";

import React, { useEffect, useState } from "react";

interface ScoreBarProps {
  label: string;
  score: number;
  color?: string;
}

export default function ScoreBar({ label, score, color = "bg-success" }: ScoreBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span className="text-xs font-mono font-bold text-foreground">
          {score}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-foreground/5 overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
