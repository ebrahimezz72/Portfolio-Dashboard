"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

export default function AddCategoryModal({ isOpen, onClose, onAdd }: AddCategoryModalProps) {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim());
    setName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
      <div className="bg-card border border-border w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Skills</p>
            <h3 className="text-xl font-bold text-foreground">Add New Domain</h3>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
              Domain Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Frontend, DevOps, Design..."
              className="w-full bg-background border border-border py-3 px-4 text-sm font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
              autoFocus
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-foreground/5 hover:bg-foreground/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest bg-accent text-accent-foreground hover:brightness-110 transition-all"
            >
              Add Domain
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
