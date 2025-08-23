import clsx from "clsx";
import type { ReactNode, ElementType, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  asChild?: boolean;
  children: ReactNode;
  as?: ElementType;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "md",
  loading = false,
  asChild = false,
  className,
  as,
  ...props
}) => {
  const baseStyles = clsx(
    "rounded-md font-medium transition-colors focus:outline-none flex items-center justify-center",
    variant === "default" &&
      "bg-secondary text-white hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed",
    variant === "ghost" &&
      "bg-transparent text-secondary hover:text-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed",
    size === "sm" && "px-2 py-1 text-sm",
    size === "md" && "px-4 py-2 text-md",
    size === "lg" && "px-6 py-3 text-lg",
    className
  );

  const content = (
    <>
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </>
  );

  // Si asChild = true et qu'on a un composant 'as', on rend ce composant
  if (asChild && as) {
    const Component = as;
    return <Component {...props} className={baseStyles}>{content}</Component>;
  }

  // Sinon bouton normal
  return (
    <button {...props} className={baseStyles} disabled={loading || props.disabled}>
      {content}
    </button>
  );
};
