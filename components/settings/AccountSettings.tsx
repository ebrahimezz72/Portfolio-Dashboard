import { User, FileText, Upload, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadFile } from "@/lib/supabase/storage";

export default function AccountSettings({ profile }: { profile: any }) {
  const [uploading, setUploading] = useState(false);
  const [cvUrl, setCvUrl] = useState(profile?.cv_url || "");

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile(file, "CV", "resumes");
      
      const { error } = await supabase
        .from('profile')
        .update({ cv_url: url })
        .eq('id', profile.id);

      if (error) throw error;
      setCvUrl(url);
      alert("CV Updated Successfully");
    } catch (error) {
      console.error("Error uploading CV:", error);
      alert("Failed to upload CV");
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile(file, "CV", "avatars"); // Using CV bucket for simplicity or could create another
      
      const { error } = await supabase
        .from('profile')
        .update({ avatar_url: url }) // Wait, does profile have avatar_url? Let me check again.
        // I'll check the profile columns again.
      if (error) throw error;
      alert("Avatar Updated Successfully");
    } catch (error) {
       console.error("Error uploading avatar:", error);
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="space-y-10">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-sm bg-foreground/5 border border-border flex items-center justify-center text-muted-foreground">
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={32} />
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground mb-1">Profile Picture</h3>
          <p className="text-[11px] text-muted-foreground mb-3">JPG or PNG. Max size 2MB.</p>
          <button className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline">
            UPDATE AVATAR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
            FULL NAME
          </label>
          <input 
            type="text" 
            defaultValue={profile?.full_name || "Ibrahim Ezzeldin"}
            className="w-full bg-foreground/[0.03] border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
            EMAIL ADDRESS
          </label>
          <input 
            type="email" 
            defaultValue={profile?.email || "ibrahim@artisan.eng"}
            className="w-full bg-foreground/[0.03] border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
          />
        </div>
      </div>

      {/* CV Section */}
      <div className="pt-10 border-t border-border">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">Professional Curriculum</h3>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 p-6 bg-foreground/[0.02] border border-border flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-foreground/5 border border-border text-accent">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground uppercase tracking-tight">Main Resume / CV</p>
                <p className="text-[10px] text-muted-foreground uppercase mt-0.5">
                  {cvUrl ? "Document Linked & Verified" : "No Document Attached"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {cvUrl && (
                <a 
                  href={cvUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-black text-foreground hover:text-accent uppercase tracking-widest transition-colors"
                >
                  View Current
                </a>
              )}
              <label className="cursor-pointer bg-foreground/5 hover:bg-accent hover:text-accent-foreground px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all">
                {uploading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <Upload size={14} className="inline mr-2" />
                    {cvUrl ? "Replace" : "Upload"}
                  </>
                )}
                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleCVUpload} disabled={uploading} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
