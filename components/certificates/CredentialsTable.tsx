import React from "react";
import { Eye, Trash2, ShieldCheck, Pencil } from "lucide-react";

interface Credential {
  name: string;
  type: string;
  org: string;
  date: string;
  id: string;
  url?: string;
  imageUrl?: string;
}

 interface CredentialsTableProps {
  credentials: Credential[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export default function CredentialsTable({ credentials, onEdit, onDelete, onView }: CredentialsTableProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Background Subtle Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
        <span className="text-[15vw] font-black tracking-tighter uppercase italic">ARTISAN</span>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <th className="px-6 py-4">Credential Name</th>
              <th className="px-6 py-4 text-center">Issuing Organization</th>
              <th className="px-6 py-4 text-center">Issue Date</th>
              <th className="px-6 py-4 text-center">Credential ID</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {credentials.map((cred) => (
              <tr key={cred.id} className="group hover:bg-foreground/[0.02] transition-colors">
                <td className="px-6 py-6 min-w-[300px]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-foreground/5 border border-border flex items-center justify-center text-muted-foreground group-hover:text-accent transition-colors">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">{cred.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase mt-0.5">{cred.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 text-center text-sm text-muted-foreground">
                  {cred.org}
                </td>
                <td className="px-6 py-6 text-center text-sm text-muted-foreground whitespace-nowrap">
                  {cred.date}
                </td>
                <td className="px-6 py-6 text-center text-[11px] font-mono text-muted-foreground tracking-tight">
                  {cred.id}
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex items-center justify-end gap-4 text-muted-foreground">
                    <button 
                      onClick={() => onEdit(cred.id)}
                      className="hover:text-foreground transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => onView(cred.id)}
                      className="hover:text-accent transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(cred.id)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
