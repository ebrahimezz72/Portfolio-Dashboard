"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Rocket, Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadFile } from "@/lib/supabase/storage";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project?: any; // If provided, we are in edit mode
}

export default function ProjectModal({ isOpen, onClose, onSuccess, project }: ProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    type: "Web Development",
    tech_stack: "",
    design_tools: "",
    repo_url: "",
    live_demo_url: "",
    case_study_url: "",
    behance_url: "",
    is_featured: false,
    display_order: 0
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        slug: project.slug || "",
        description: project.description || "",
        type: project.type || "Web Development",
        tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(", ") : "",
        design_tools: Array.isArray(project.design_tools) ? project.design_tools.join(", ") : "",
        repo_url: project.repo_url || "",
        live_demo_url: project.live_demo_url || "",
        case_study_url: project.case_study_url || "",
        behance_url: project.behance_url || "",
        is_featured: project.is_featured || false,
        display_order: project.display_order || 0
      });
      setThumbnailPreview(project.thumbnail_url || null);
    } else {
      setFormData({
        title: "",
        slug: "",
        description: "",
        type: "Web Development",
        tech_stack: "",
        design_tools: "",
        repo_url: "",
        live_demo_url: "",
        case_study_url: "",
        behance_url: "",
        is_featured: false,
        display_order: 0
      });
      setThumbnailPreview(null);
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let thumbnail_url = thumbnailPreview;
      if (thumbnailFile) {
        thumbnail_url = await uploadFile(thumbnailFile, "Projects", "thumbnails");
      }

      const dataToSave = {
        ...formData,
        thumbnail_url,
        tech_stack: formData.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
        design_tools: formData.design_tools.split(',').map(s => s.trim()).filter(Boolean),
      };

      let error;
      if (project) {
        // Update
        const { error: updateError } = await supabase
          .from('projects')
          .update(dataToSave)
          .eq('id', project.id);
        error = updateError;
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from('projects')
          .insert([dataToSave]);
        error = insertError;
      }

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card border border-border w-full max-w-4xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-foreground/[0.02]">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight uppercase">
              {project ? "Update Project" : "Launch New Project"}
            </h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
              {project ? "Refining the architectural blueprint" : "Ship your latest work to the inventory"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column: Core Data */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Project Title</label>
                  <input 
                    required
                    type="text" 
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. Nexus CRM Platform"
                    className="w-full bg-foreground/[0.03] border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Slug (Auto-generated)</label>
                  <input 
                    required
                    type="text" 
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full bg-foreground/[0.03] border border-border px-4 py-3 text-sm text-muted-foreground focus:outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Description</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Summarize the architectural impact and technical challenges..."
                  className="w-full bg-foreground/[0.03] border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Project Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-foreground/[0.03] border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all appearance-none"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Full Stack">Full Stack</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Display Order</label>
                  <input 
                    type="number" 
                    value={formData.display_order}
                    onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                    className="w-full bg-foreground/[0.03] border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Media & Links */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tech Stack (Comma separated)</label>
                <input 
                  type="text" 
                  value={formData.tech_stack}
                  onChange={(e) => setFormData({...formData, tech_stack: e.target.value})}
                  placeholder="React, Next.js, Supabase, Tailwind..."
                  className="w-full bg-foreground/[0.03] border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
                />
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Main Preview Image</label>
                 <div className={`relative border-2 border-dashed border-border aspect-video flex flex-col items-center justify-center transition-all ${!thumbnailPreview ? 'hover:border-accent/50 hover:bg-accent/[0.02]' : ''}`}>
                    {thumbnailPreview ? (
                      <div className="relative w-full h-full">
                        <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); }}
                          className="absolute top-2 right-2 p-1.5 bg-foreground/60 text-foreground hover:bg-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6">
                        <Upload className="text-muted-foreground mb-3" size={24} />
                        <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">Upload 1920x1080</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                      </label>
                    )}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Repo URL</label>
                  <input 
                    type="url" 
                    value={formData.repo_url}
                    onChange={(e) => setFormData({...formData, repo_url: e.target.value})}
                    placeholder="https://github..."
                    className="w-full bg-foreground/[0.03] border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Demo</label>
                  <input 
                    type="url" 
                    value={formData.live_demo_url}
                    onChange={(e) => setFormData({...formData, live_demo_url: e.target.value})}
                    placeholder="https://demo..."
                    className="w-full bg-foreground/[0.03] border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-border flex items-center justify-end gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button 
              disabled={loading}
              type="submit"
              className="bg-accent text-accent-foreground px-8 py-3 font-black text-[10px] uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {project ? "Syncing..." : "Deploying..."}
                </>
              ) : (
                <>
                  {project ? <Plus size={16} /> : <Rocket size={16} />}
                  {project ? "Commit Changes" : "Confirm Launch"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
