import type { ReactNode } from "react";

interface AvatarProps {
  children: ReactNode;
  className?: string;
}

export const Avatar = ({ children, className }: AvatarProps) => (
  <div
    className={`inline-flex items-center justify-center rounded-full overflow-hidden border border-primary ${className}`}
  >
    {children}
  </div>
);

export const AvatarFallback = ({ children, className }: AvatarProps) => (
  <div
    className={`flex items-center justify-center w-full h-full bg-primary/10 text-primary ${className}`}
  >
    {children}
  </div>
);
