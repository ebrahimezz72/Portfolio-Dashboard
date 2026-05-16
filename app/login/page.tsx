"use client";

import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Compass, Shield, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white rounded-full opacity-50" />
      </div>

      {/* Header */}
      <div className="text-center mb-10 space-y-4">
        <div className="w-20 h-20 bg-foreground/5 border border-white/10 rounded-sm mx-auto flex items-center justify-center mb-6 overflow-hidden p-4">
          <img src="/logo.png" alt="Artisan Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-4xl font-black text-foreground tracking-[0.2em] uppercase">Artisan Admin</h1>
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-medium opacity-60">
          Engineering Studio Portal
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-card border border-border p-10 rounded-sm relative z-10 shadow-2xl">
        <form className="space-y-8" onSubmit={handleSignIn}>
          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest text-center">
                {error}
              </div>
            )}
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="architect@editorial.eng"
                  required
                  className="w-full bg-foreground/[0.03] border border-border py-4 pl-12 pr-4 text-sm text-foreground focus:outline-none focus:border-accent transition-all rounded-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                Security Key
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-foreground/[0.03] border border-border py-4 pl-12 pr-12 text-sm text-foreground focus:outline-none focus:border-accent transition-all rounded-none"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded-none border-border bg-foreground/5 checked:bg-accent accent-accent" />
              <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">Keep me signed in</span>
            </label>
            <button type="button" className="text-[11px] text-muted-foreground hover:text-accent hover:underline underline-offset-4 transition-all">
              Forgot Key?
            </button>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-accent-foreground py-5 font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Sign In"} <ArrowRight size={18} strokeWidth={3} />
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-border/50 text-center space-y-6">
          <p className="text-[11px] text-muted-foreground font-medium">New to the Engineering Studio?</p>
          <button className="w-full border border-border py-4 font-black text-[10px] uppercase tracking-widest text-foreground hover:bg-foreground/5 transition-all">
            Request Access
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 flex flex-col items-center gap-8">
        <p className="text-[10px] text-muted-foreground font-bold tracking-[0.5em] opacity-40">V2.4.0</p>
        
        <div className="flex items-center gap-8">
          {["System Status", "Privacy Protocol", "Documentation"].map((link) => (
            <button key={link} className="text-[9px] font-black text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors">
              {link}
            </button>
          ))}
        </div>
      </div>

      {/* Server Status Widget */}
      <div className="fixed bottom-10 left-10 hidden lg:flex items-center gap-4 bg-card border border-border p-4 rounded-sm">
        <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(200,217,191,0.5)]" />
        <div className="text-[10px] leading-tight">
          <p className="text-muted-foreground font-bold uppercase tracking-widest mb-1">Node Server</p>
          <p className="text-foreground font-black uppercase tracking-tighter">Amsterdam Cluster • Active</p>
        </div>
      </div>
    </div>
  );
}
