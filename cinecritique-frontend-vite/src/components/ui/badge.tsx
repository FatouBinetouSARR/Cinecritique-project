import * as React from "react";
import { cn } from "../../lib/utils";

const Badge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium bg-indigo-100 text-indigo-800",
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge };
