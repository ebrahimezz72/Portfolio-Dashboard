"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
}

interface ToastContextType {
  toastSuccess: (msg: string) => void;
  toastError: (msg: string) => void;
  toastWarning: (msg: string) => void;
  showConfirm: (opts: ConfirmOptions) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-green-400" />,
  error:   <XCircle size={18} className="text-red-400" />,
  warning: <AlertTriangle size={18} className="text-yellow-400" />,
  info:    <Info size={18} className="text-blue-400" />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirm, setConfirm] = useState<ConfirmOptions | null>(null);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const toastSuccess = useCallback((msg: string) => addToast("success", msg), [addToast]);
  const toastError   = useCallback((msg: string) => addToast("error", msg),   [addToast]);
  const toastWarning = useCallback((msg: string) => addToast("warning", msg), [addToast]);

  const showConfirm = useCallback((opts: ConfirmOptions) => {
    setConfirm(opts);
  }, []);

  const handleConfirm = () => {
    confirm?.onConfirm();
    setConfirm(null);
  };

  return (
    <ToastContext.Provider value={{ toastSuccess, toastError, toastWarning, showConfirm }}>
      {children}

      {/* Toasts */}
      <div className="fixed bottom-6 left-6 z-[200] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-3 bg-card border border-border px-5 py-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 min-w-[280px]"
          >
            {iconMap[t.type]}
            <p className="text-sm font-bold text-foreground tracking-wide flex-1">{t.message}</p>
            <button
              onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Confirm Dialog */}
      {confirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-6">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                {confirm.danger ? "⚠ Destructive Action" : "Confirmation Required"}
              </p>
              <h3 className="text-xl font-bold text-foreground">{confirm.title}</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground leading-relaxed">{confirm.message}</p>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground bg-foreground/5 hover:bg-foreground/10 transition-all"
              >
                {confirm.cancelText || "Cancel"}
              </button>
              <button
                onClick={handleConfirm}
                className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  confirm.danger
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-accent text-accent-foreground hover:brightness-110"
                }`}
              >
                {confirm.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}
