import * as React from "react";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white 
                   rounded-xl shadow-2xl border border-secondary w-full max-w-md p-6 sm:p-8    
                   animate-in fade-in-50 zoom-in-95 
                   max-h-[90vh] overflow-y-auto"
      >
        {/* Bouton de fermeture */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          onClick={() => onOpenChange(false)}
          aria-label="Fermer"
        >
          <X className="w-8 h-8" />
        </button>

        {children}
      </div>
    </div>
  );
};

export const DialogContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <div className={`mt-2 ${className}`}>{children}</div>;

export const DialogHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <div className={`mb-4 text-center ${className}`}>{children}</div>;

export const DialogTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <h2 className={`text-2xl font-bold tracking-wide ${className}`}>{children}</h2>;

export const DialogDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <p className={`text-gray-400 text-sm mt-1 ${className}`}>{children}</p>;
