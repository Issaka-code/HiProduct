"use client";
import { useToastStore } from "@/lib/store";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: any, onRemove: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-sky-400" />,
  };

  const glows = {
    success: "shadow-[0_0_30px_rgba(52,211,153,0.3)]",
    error: "shadow-[0_0_30px_rgba(251,113,133,0.3)]",
    info: "shadow-[0_0_30px_rgba(56,189,248,0.3)]",
  };

  return (
    <div 
      className={`
        pointer-events-auto
        flex items-center gap-4 px-5 py-4 min-w-[340px] max-w-[440px]
        bg-[#0a0a0c]/90 backdrop-blur-2xl rounded-2xl border border-white/20
        transition-all duration-500 transform
        ${glows[toast.type as keyof typeof glows]}
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}
      `}
    >
      <div className="flex-shrink-0">
        {icons[toast.type as keyof typeof icons]}
      </div>
      
      <div className="flex-1">
        <p className="text-sm font-bold text-white leading-tight">
          {toast.message}
        </p>
      </div>

      <button 
        onClick={onRemove}
        className="flex-shrink-0 text-muted-foreground hover:text-white transition-colors p-1"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar Animation */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full overflow-hidden rounded-b-2xl">
        <div className="h-full bg-primary/40 animate-toast-progress" />
      </div>

      <style jsx>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-toast-progress {
          animation: toast-progress 3000ms linear forwards;
        }
      `}</style>
    </div>
  );
}
