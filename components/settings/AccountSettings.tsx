import { User } from "lucide-react";

export default function AccountSettings({ profile }: { profile: any }) {
  return (
    <div className="space-y-10">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-sm bg-white/5 border border-border flex items-center justify-center text-muted-foreground">
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
          <h3 className="text-sm font-bold text-white mb-1">Profile Picture</h3>
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
            className="w-full bg-white/[0.03] border border-border px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-all"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
            EMAIL ADDRESS
          </label>
          <input 
            type="email" 
            defaultValue={profile?.email || "ibrahim@artisan.eng"}
            className="w-full bg-white/[0.03] border border-border px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-all"
          />
        </div>
      </div>
    </div>
  );
}
