"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadFile } from "@/lib/supabase/storage";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  certificate?: any; // If provided, we are in edit mode
}

export default function CertificateModal({ isOpen, onClose, onSuccess, certificate }: CertificateModalProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    credential_url: "",
    issued_year: new Date().getFullYear().toString(),
    icon_type: "Professional",
    display_order: 0
  });

  useEffect(() => {
    if (certificate) {
      setFormData({
        title: certificate.title || "",
        issuer: certificate.issuer || "",
        credential_url: certificate.credential_url || "",
        issued_year: certificate.issued_year?.toString() || new Date().getFullYear().toString(),
        icon_type: certificate.icon_type || "Professional",
        display_order: certificate.display_order || 0
      });
      setImagePreview(certificate.image_url || null);
    } else {
      setFormData({
        title: "",
        issuer: "",
        credential_url: "",
        issued_year: new Date().getFullYear().toString(),
        icon_type: "Professional",
        display_order: 0
      });
      setImagePreview(null);
    }
  }, [certificate, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let image_url = imagePreview;
      if (imageFile) {
        image_url = await uploadFile(imageFile, "certificates", "certs");
      }

      const dataToSave = {
        ...formData,
        image_url,
        issued_year: parseInt(formData.issued_year)
      };

      let error;
      if (certificate) {
        // Update
        const { error: updateError } = await supabase
          .from('certificates')
          .update(dataToSave)
          .eq('id', certificate.id);
        error = updateError;
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from('certificates')
          .insert([dataToSave]);
        error = insertError;
      }

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving certificate:", error);
      alert("Failed to save certificate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card border border-border w-full max-w-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-foreground/[0.02]">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight uppercase">
                {certificate ? "Update Credential" : "Add New Credential"}
            </h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                {certificate ? "Refining your proof of expertise" : "Verify your expertise in the vault"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Details */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Certificate Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full bg-foreground/[0.03] border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Issuing Organization</label>
                <input 
                  required
                  type="text" 
                  value={formData.issuer}
                  onChange={(e) => setFormData({...formData, issuer: e.target.value})}
                  placeholder="e.g. Amazon Web Services"
                  className="w-full bg-foreground/[0.03] border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Issued Year</label>
                  <input 
                    required
                    type="number" 
                    value={formData.issued_year}
                    onChange={(e) => setFormData({...formData, issued_year: e.target.value})}
                    className="w-full bg-foreground/[0.03] border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Type</label>
                  <select 
                    value={formData.icon_type}
                    onChange={(e) => setFormData({...formData, icon_type: e.target.value})}
                    className="w-full bg-foreground/[0.03] border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all appearance-none"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Academic">Academic</option>
                    <option value="Specialization">Specialization</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Credential URL</label>
                <input 
                  type="url" 
                  value={formData.credential_url}
                  onChange={(e) => setFormData({...formData, credential_url: e.target.value})}
                  placeholder="https://..."
                  className="w-full bg-foreground/[0.03] border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
                />
              </div>
            </div>

            {/* Right Column: Image Upload */}
            <div className="space-y-6">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Credential Image / Logo</label>
              <div 
                className={`relative border-2 border-dashed border-border aspect-square flex flex-col items-center justify-center transition-all ${!imagePreview ? 'hover:border-accent/50 hover:bg-accent/[0.02]' : ''}`}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full p-2">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    <button 
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-4 right-4 p-1.5 bg-foreground/60 text-foreground hover:bg-red-500 transition-colors rounded-none"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-8 text-center">
                    <Upload className="text-muted-foreground mb-4" size={32} />
                    <span className="text-xs font-bold text-foreground uppercase tracking-widest">Upload Media</span>
                    <span className="text-[10px] text-muted-foreground uppercase mt-2">JPG, PNG or WEBP (Max 2MB)</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
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
                  Processing...
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  {certificate ? "Sync Changes" : "Authorize & Save"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
