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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl border border-gray-700
                   p-6 sm:p-8 overflow-y-auto max-h-[90vh] animate-in fade-in-50 scale-in-95"
      >
        {/* Bouton de fermeture */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-secondary rounded-full"
          onClick={() => onOpenChange(false)}
          aria-label="Fermer"
        >
          <X className="w-6 h-6" />
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
}) => <h2 className={`text-2xl sm:text-3xl font-bold ${className}`}>{children}</h2>;

export const DialogDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <p className={`text-gray-400 text-sm sm:text-base mt-1 ${className}`}>{children}</p>;
