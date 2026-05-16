import React from "react";
import { Archive, Trash2, Reply, CheckCircle2, Phone, DollarSign, Briefcase, Mail, User } from "lucide-react";
import MessageAnalyzer from "../ai/MessageAnalyzer";

interface MessageDetailProps {
  message: {
    id: string;
    sender: string;
    email: string;
    subject: string;
    date: string;
    content: string;
    budget?: string;
    project_type?: string;
    phone?: string;
  };
}

export default function MessageDetail({ message }: MessageDetailProps) {
  return (
    <div className="flex-1 flex flex-col min-h-[900px]">
      {/* Action Toolbar */}
      <div className="p-4 border-b border-border bg-foreground/[0.01] flex items-center justify-between">
        <div className="flex items-center gap-4">
           <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-3 py-1 border border-border bg-foreground/5">
             Ref: {message.id.split('-')[0].toUpperCase()}
           </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Archive">
            <Archive size={18} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-red-400 transition-colors" title="Delete">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Sender & Metadata Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-8 border-b border-border/50">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded bg-accent/5 border border-border flex items-center justify-center text-accent">
                <User size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">{message.sender}</h2>
                <div className="flex items-center gap-3 text-muted-foreground mt-1">
                  <Mail size={14} />
                  <span className="text-sm font-medium">{message.email}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Received On</p>
              <p className="text-sm text-foreground font-medium">{message.date}</p>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 bg-foreground/[0.02] border border-border">
              <div className="flex items-center gap-3 text-accent mb-2">
                <Briefcase size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Project Type</span>
              </div>
              <p className="text-sm text-foreground font-bold">{message.project_type || "General Inquiry"}</p>
            </div>
            
            <div className="p-5 bg-foreground/[0.02] border border-border">
              <div className="flex items-center gap-3 text-accent mb-2">
                <DollarSign size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Estimated Budget</span>
              </div>
              <p className="text-sm text-foreground font-bold">{message.budget || "Not Specified"}</p>
            </div>

            <div className="p-5 bg-foreground/[0.02] border border-border">
              <div className="flex items-center gap-3 text-accent mb-2">
                <Phone size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Contact Number</span>
              </div>
              <p className="text-sm text-foreground font-bold">{message.phone || "No Phone Provided"}</p>
            </div>
          </div>

          {/* AI Analyzer Tool */}
          <MessageAnalyzer message={message} />

          {/* Subject & Message */}
          <div className="space-y-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              {message.subject}
            </h1>
            <div className="bg-foreground/[0.01] p-8 border-l-2 border-accent text-muted-foreground leading-relaxed text-lg font-light whitespace-pre-wrap">
              {message.content}
            </div>
          </div>

        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-8 border-t border-border flex gap-4 bg-foreground/[0.01]">
        <button className="flex-1 lg:flex-none bg-accent text-accent-foreground px-10 py-5 font-black text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-3">
          <Reply size={20} strokeWidth={3} />
          Reply Manually
        </button>
        <button className="flex-1 lg:flex-none bg-foreground/5 border border-border text-foreground px-10 py-5 font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-3">
          <CheckCircle2 size={20} />
          Resolve Inquiry
        </button>
      </div>
    </div>
  );
}
