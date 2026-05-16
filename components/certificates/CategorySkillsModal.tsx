"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader2, Save, MoveVertical } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CategorySkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: any;
}

export default function CategorySkillsModal({ isOpen, onClose, onSuccess, category }: CategorySkillsModalProps) {
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [skills, setSkills] = useState<any[]>([]);
  const [newSkillName, setNewSkillName] = useState("");

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setSkills(category.skills || []);
    }
  }, [category, isOpen]);

  if (!isOpen || !category) return null;

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('skills')
        .insert([{
          name: newSkillName.trim(),
          category_id: category.id,
          display_order: skills.length + 1
        }])
        .select();

      if (error) throw error;
      if (data) setSkills([...skills, data[0]]);
      setNewSkillName("");
    } catch (error) {
      console.error("Error adding skill:", error);
      alert("Failed to add skill.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSkills(skills.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting skill:", error);
      alert("Failed to delete skill.");
    }
  };

  const handleSaveCategory = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('skill_categories')
        .update({ name: categoryName })
        .eq('id', category.id);

      if (error) throw error;
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category name.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-foreground/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-card border border-border w-full max-w-xl relative overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-foreground/[0.02]">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight uppercase">Manage Domain</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Configure skills & category identity</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-10 overflow-y-auto">
          {/* Category Name */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Domain Name</label>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="flex-1 bg-foreground/[0.03] border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
              />
              <button 
                onClick={handleSaveCategory}
                disabled={loading || categoryName === category.name}
                className="bg-foreground/5 border border-border px-4 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Save size={18} />
              </button>
            </div>
          </div>

          {/* Skills List */}
          <div className="space-y-6">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block text-accent">Active Skill Inventory</label>
            
            <div className="space-y-2">
              {skills.map((skill) => (
                <div 
                  key={skill.id} 
                  className="flex items-center justify-between p-4 bg-foreground/[0.02] border border-border hover:border-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <MoveVertical size={14} className="text-muted-foreground/30 cursor-grab" />
                    <span className="text-sm text-foreground font-medium">{skill.name}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Skill */}
            <form onSubmit={handleAddSkill} className="flex gap-4 pt-4">
              <input 
                type="text" 
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Add new capability..."
                className="flex-1 bg-foreground/[0.03] border border-dashed border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
              />
              <button 
                type="submit"
                disabled={loading || !newSkillName.trim()}
                className="bg-accent text-accent-foreground px-6 py-3 font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-foreground/[0.01] flex justify-center">
            <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em]">All changes are synced in real-time with the core database</p>
        </div>
      </div>
    </div>
  );
}
