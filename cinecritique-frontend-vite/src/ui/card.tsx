import * as React from "react";
import { cn } from "../lib/utils";

// Card principal
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-2xl border bg-white shadow p-4", className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

// Contenu de la Card
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-2", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

// Header de la Card
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-4 flex flex-col space-y-1", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

// Titre de la Card
const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export { Card, CardContent, CardHeader, CardTitle };
