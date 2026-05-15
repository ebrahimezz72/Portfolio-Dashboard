import React from "react";
import { Plus } from "lucide-react";

export default function FAB() {
  return (
    <button className="fixed bottom-8 right-8 w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-2xl flex items-center justify-center hover:brightness-110 transition-all z-50">
      <Plus size={28} />
    </button>
  );
}
