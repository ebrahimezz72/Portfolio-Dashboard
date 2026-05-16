"use client";

import React from "react";
import { X, ExternalLink, ShieldCheck, Calendar, Building2, Tag } from "lucide-react";

interface ViewCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: any;
}

export default function ViewCertificateModal({ isOpen, onClose, certificate }: ViewCertificateModalProps) {
  if (!isOpen || !certificate) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-foreground/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-card border border-border w-full max-w-4xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-foreground/50 hover:bg-white/10 text-foreground transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left: Certificate Image */}
        <div className="flex-[1.5] bg-black/40 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-border min-h-[300px]">
          {certificate.imageUrl ? (
            <img 
              src={certificate.imageUrl} 
              alt={certificate.name} 
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-muted-foreground opacity-20">
              <ShieldCheck size={80} strokeWidth={1} />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Preview Available</p>
            </div>
          )}
        </div>

        {/* Right: Information */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-between space-y-10">
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-accent mb-2">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Credential</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight leading-tight uppercase">
                {certificate.name}
              </h2>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4 group">
                <div className="p-2 bg-foreground/5 border border-border text-muted-foreground group-hover:text-foreground transition-colors">
                  <Building2 size={16} />
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Issuer</p>
                  <p className="text-sm text-foreground uppercase font-bold">{certificate.org}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-2 bg-foreground/5 border border-border text-muted-foreground group-hover:text-foreground transition-colors">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Issue Date</p>
                  <p className="text-sm text-foreground uppercase font-bold">{certificate.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-2 bg-foreground/5 border border-border text-muted-foreground group-hover:text-foreground transition-colors">
                  <Tag size={16} />
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Classification</p>
                  <p className="text-sm text-foreground uppercase font-bold">{certificate.type}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border">
            {certificate.url ? (
              <a 
                href={certificate.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-accent text-accent-foreground px-8 py-4 font-black text-[11px] uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-3"
              >
                <ExternalLink size={16} />
                Verify Credential
              </a>
            ) : (
              <p className="text-[10px] text-muted-foreground uppercase text-center italic tracking-widest">
                No external verification link provided
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
