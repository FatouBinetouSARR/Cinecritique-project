import { cn } from "../../lib/utils";
import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Classe CSS optionnelle pour personnaliser le style
   */
  className?: string;
  
  /**
   * Hauteur du squelette en pixels
   * @default '1rem'
   */
  height?: number | string;
  
  /**
   * Largeur du squelette
   * @default '100%'
   */
  width?: number | string;
  
  /**
   * Forme du squelette
   * @default 'rectangle'
   */
  shape?: 'rectangle' | 'circle' | 'rounded';
  
  /**
   * Animation du squelette
   * @default 'pulse'
   */
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-neutral-800", className)}
      {...props}
    />
  );
}
